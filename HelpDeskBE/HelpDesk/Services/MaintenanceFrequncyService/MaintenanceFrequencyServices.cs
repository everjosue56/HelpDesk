using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceFrequencyDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.MaintenanceFrequncyService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.MaintenanceFrequencyService
{
    public class MaintenanceFrequencyService : IMaintenanceFrequencyService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger<MaintenanceFrequencyService> _logger;

        public MaintenanceFrequencyService(
            ApplicationDbContext context,
            IMapper mapper,
            IAuthService authService,
            ILogger<MaintenanceFrequencyService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<MaintenanceFrequencyDto>> GetAllAsync(MaintenanceFrequencyFilterDto filter)
        {
            try
            {
                var query = _context.MaintenanceFrequencies
                    .Where(x => !x.IsDeleted)
                    .AsQueryable();

                // Filtro por nombre
                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(mf => mf.Name.ToLower().Contains(searchTerm));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                // Mapeo de entidades a DTOs usando AutoMapper
                var dtos = _mapper.Map<IEnumerable<MaintenanceFrequencyDto>>(entities);

                return new PagedResponseDto<MaintenanceFrequencyDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Frecuencias de mantenimiento obtenidas correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las frecuencias de mantenimiento paginadas.");
                return new PagedResponseDto<MaintenanceFrequencyDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar las frecuencias de mantenimiento."
                };
            }
        }

        public async Task<ResponseDto<MaintenanceFrequencyDto>> GetByIdAsync(long id)
        {
            var entity = await _context.MaintenanceFrequencies.FindAsync(id);

            if (entity == null || entity.IsDeleted)
            {
                return new ResponseDto<MaintenanceFrequencyDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Frecuencia de mantenimiento no encontrada."
                };
            }

            return new ResponseDto<MaintenanceFrequencyDto>
            {
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<MaintenanceFrequencyDto>(entity)
            };
        }

        public async Task<ResponseDto<MaintenanceFrequencyDto>> CreateAsync(CreateMaintenanceFrequencyDto dto)
        {
            try
            {
                var entity = _mapper.Map<MaintenanceFrequencyEntity>(dto);
                var currentUserId = _authService.GetUserId();

                // Campos de auditoría
                entity.CreatedDate = DateTime.Now;
                entity.CreatedBy = currentUserId;
                entity.IsDeleted = false;

                _context.MaintenanceFrequencies.Add(entity);
                await _context.SaveChangesAsync();

                return await GetByIdAsync(entity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la frecuencia de mantenimiento.");
                return new ResponseDto<MaintenanceFrequencyDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error al intentar crear la frecuencia de mantenimiento."
                };
            }
        }

        public async Task<ResponseDto<MaintenanceFrequencyDto>> UpdateAsync(UpdateMaintenanceFrequecyDto dto, long id)
        {
            try
            {
                var entity = await _context.MaintenanceFrequencies.FindAsync(id);

                if (entity == null || entity.IsDeleted)
                {
                    return new ResponseDto<MaintenanceFrequencyDto>
                    {
                        Status = false,
                        StatusCode = 404,
                        Message = "Frecuencia de mantenimiento no encontrada."
                    };
                }

                var currentUserId = _authService.GetUserId();

                _mapper.Map(dto, entity);
                entity.UpdatedDate = DateTime.Now;
                entity.UpdatedBy = currentUserId;

                _context.MaintenanceFrequencies.Update(entity);
                await _context.SaveChangesAsync();

                return await GetByIdAsync(entity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la frecuencia de mantenimiento con ID {Id}.", id);
                return new ResponseDto<MaintenanceFrequencyDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error al actualizar la frecuencia de mantenimiento."
                };
            }
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var entity = await _context.MaintenanceFrequencies.FindAsync(id);

                if (entity == null || entity.IsDeleted)
                {
                    return new ResponseDto<bool>
                    {
                        Status = false,
                        StatusCode = 404,
                        Message = "Frecuencia de mantenimiento no encontrada.",
                        Data = false
                    };
                }

                // Aplicación de Soft Delete
                entity.IsDeleted = true;
                entity.UpdatedDate = DateTime.Now;
                entity.UpdatedBy = _authService.GetUserId();

                _context.MaintenanceFrequencies.Update(entity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Frecuencia de mantenimiento desactivada correctamente.",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar la frecuencia de mantenimiento con ID {Id}.", id);
                return new ResponseDto<bool>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno al procesar la desactivación.",
                    Data = false
                };
            }
        }
    }
}