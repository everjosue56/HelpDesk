using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.ImpactDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.ImpactServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class ImpactService : IImpactService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public ImpactService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<ImpactService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<ImpactDto>> GetAllAsync(ImpactFilterDto filter)
        {
            try
            {
                var query = _context.Impacts.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(i => i.Name.ToLower().Contains(searchTerm));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var impactsDto = _mapper.Map<IEnumerable<ImpactDto>>(entities);

                return new PagedResponseDto<ImpactDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Niveles de impacto obtenidos correctamente.",
                    Data = impactsDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los niveles de impacto.");
                return new PagedResponseDto<ImpactDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
        }

        public async Task<ResponseDto<ImpactDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Impacts.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<ImpactDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Impacto no encontrado."  
                };
            }

            return new ResponseDto<ImpactDto>
            {
                Status = true,
                Data = _mapper.Map<ImpactDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<ImpactDto>> CreateAsync(CreateImpactDto dto)
        {
            var entity = _mapper.Map<ImpactEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;

            _context.Impacts.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<ImpactDto>
            {
                Status = true,
                Data = _mapper.Map<ImpactDto>(entity),
                StatusCode = 201
            };
        }

        public async Task<ResponseDto<ImpactDto>> UpdateAsync(UpdateImpactDto dto, long id)
        {
           
            var entity = await _context.Impacts.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<ImpactDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: el impacto no existe."
                };
            }

            _mapper.Map(dto, entity);

            var currentUserId = _authService.GetUserId();

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Impacts.Update(entity);  
            await _context.SaveChangesAsync();

            return new ResponseDto<ImpactDto>
            {
                Status = true,
                Data = _mapper.Map<ImpactDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
          
            var entity = await _context.Impacts.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool>
                {
                    Status = false,
                    Data = false,
                    StatusCode = 404,
                    Message = "El registro ya no existe."
                };
            }

            _context.Impacts.Remove(entity);  
            await _context.SaveChangesAsync();

            return new ResponseDto<bool>
            {
                Status = true,
                Data = true,
                StatusCode = 200
            };
        }
    }
}