using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TypeMaintenanceDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TypeMaintenanceServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeMaintenanceService
{
    public class TypeMaintenanceService : ITypeMaintenanceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;
        public TypeMaintenanceService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<TypeMaintenanceService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<TypeMaintenanceDto>> GetAllAsync(TypeMaintenanceFilterDto filter)
        {
            try
            {
                var query = _context.TypeMaintenances
                    .Where(x => !x.IsDeleted)
                    .AsQueryable();

                // Filtro por nombre
                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(tm => tm.Name.ToLower().Contains(searchTerm));
                }

                // Ejecucion de paginacion
                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                // Mapeo de entidades filtradas 
                var typeMaintenanceDtos = _mapper.Map<IEnumerable<TypeMaintenanceDto>>(entities);

                // Retorna la repuesta 
                return new PagedResponseDto<TypeMaintenanceDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Tipos de mantenimiento obtenidos correctamente.",
                    Data = typeMaintenanceDtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los tipos de mantenimientos paginados.");
                return new PagedResponseDto<TypeMaintenanceDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
        }

        public async Task<ResponseDto<TypeMaintenanceDto>> GetByIdAsync(long id)
        {
            var entity = await _context.TypeMaintenances.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<TypeMaintenanceDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Tipo de mantenimiento no encontrado."
                };
            }

            return new ResponseDto<TypeMaintenanceDto>
            {
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<TypeMaintenanceDto>(entity)
            };
        }

        public async Task<ResponseDto<TypeMaintenanceDto>> CreateAsync(CreateTypeMaintenanceDto dto)
        {
            var entity = _mapper.Map<TypeMaintenanceEntity>(dto);
            var currentUserId = _authService.GetUserId();
            // Auditoría manual
            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;
            entity.IsDeleted = false;

            _context.TypeMaintenances.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<TypeMaintenanceDto>> UpdateAsync(UpdateTypeMaintenanceDto dto, long id)
        {
            var entity = await _context.TypeMaintenances.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<TypeMaintenanceDto> { Status = false, StatusCode = 404 };
            }

            _mapper.Map(dto, entity);
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.TypeMaintenances.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var entity = await _context.TypeMaintenances.FindAsync(id);

                if (entity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Tipo de mantenimiento no encontrada.", Data = false };
                }

                entity.IsDeleted = true;

                _context.TypeMaintenances.Update(entity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Tipo de mantenimiento desactivada correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar tipo de mantenimiento.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la desactivacion.", Data = false };
            }
        }
    }
}