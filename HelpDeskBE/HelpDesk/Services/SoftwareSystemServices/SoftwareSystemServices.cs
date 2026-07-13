using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.SoftwareSystemDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.SoftwareSystemServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class SoftwareSystemService : ISoftwareSystemService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;
        public SoftwareSystemService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<SoftwareSystemService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<SoftwareSystemDto>> GetAllAsync(SoftwareSystemFilterDto filter)
        {
            try
            {
                var query = _context.SoftwareSystems
                    .Where(ss => !ss.IsDeleted)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(ss => ss.Name.ToLower().Contains(searchTerm));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var softwareSystemsDto = _mapper.Map<IEnumerable<SoftwareSystemDto>>(entities);

                return new PagedResponseDto<SoftwareSystemDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Sistemas de software obtenidos correctamente.",
                    Data = softwareSystemsDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los sistemas de software.");
                return new PagedResponseDto<SoftwareSystemDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
        }

        public async Task<ResponseDto<SoftwareSystemDto>> GetByIdAsync(long id)
        {
            var entity = await _context.SoftwareSystems.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<SoftwareSystemDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Sistema no encontrado."
                };
            }

            return new ResponseDto<SoftwareSystemDto>
            {
                Status = true,
                Data = _mapper.Map<SoftwareSystemDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<SoftwareSystemDto>> CreateAsync(CreateSoftwareSystemDto dto)
        {
            var entity = _mapper.Map<SoftwareSystemEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;
            entity.IsDeleted = false;

            _context.SoftwareSystems.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<SoftwareSystemDto>
            {
                Status = true,
                Data = _mapper.Map<SoftwareSystemDto>(entity),
                StatusCode = 201
            };
        }

        public async Task<ResponseDto<SoftwareSystemDto>> UpdateAsync(UpdateSoftwareSystemDto dto, long id)
        {
            var entity = await _context.SoftwareSystems.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<SoftwareSystemDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: el sistema no existe."
                };
            }

            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.SoftwareSystems.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<SoftwareSystemDto>
            {
                Status = true,
                Data = _mapper.Map<SoftwareSystemDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var systemEntity = await _context.SoftwareSystems.FindAsync(id);

                if (systemEntity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Sistema no encontrada.", Data = false };
                }

                systemEntity.IsDeleted = true;

                _context.SoftwareSystems.Update(systemEntity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Sistema desactivado correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al deactivar sistema.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la desactivacion.", Data = false };

            }
        }

    }
}