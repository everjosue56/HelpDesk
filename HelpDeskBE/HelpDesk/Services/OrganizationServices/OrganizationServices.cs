using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.OrganizationsDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.Organizations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class OrganizationService : IOrganizationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;
        public OrganizationService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<OrganizationService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<OrganizationDto>> GetAllAsync(OrganizationFilterDto filter)
        {
            try
            {
                var query = _context.Organizations
                    .AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(o => o.Name.ToLower().Contains(searchTerm));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var organizationsDto = _mapper.Map<IEnumerable<OrganizationDto>>(entities);

                return new PagedResponseDto<OrganizationDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Organizaciones obtenidas correctamente.",
                    Data = organizationsDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las organizaciones.");
                return new PagedResponseDto<OrganizationDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
        }

        public async Task<ResponseDto<OrganizationDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Organizations.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<OrganizationDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Organización no encontrada."
                };
            }

            return new ResponseDto<OrganizationDto>
            {
                Status = true,
                Data = _mapper.Map<OrganizationDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<OrganizationDto>> CreateAsync(CreateOrganizationDto dto)
        {
            var entity = _mapper.Map<OrganizationEntity>(dto);
            var currentUserId = _authService.GetUserId();
            // Auditoría manual 
            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId; 


            _context.Organizations.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<OrganizationDto>
            {
                Status = true,
                Data = _mapper.Map<OrganizationDto>(entity),
                StatusCode = 201 // Created
            };
        }

        public async Task<ResponseDto<OrganizationDto>> UpdateAsync(UpdateOrganizationDto dto, long id)
        {
            var entity = await _context.Organizations.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<OrganizationDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: registro no encontrado."
                };
            }

            // Mapeo sobre el objeto existente para actualizar solo lo necesario
            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Organizations.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<OrganizationDto>
            {
                Status = true,
                Data = _mapper.Map<OrganizationDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.Organizations.FindAsync(id);

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

            _context.Organizations.Remove(entity);
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