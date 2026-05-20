using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceDto;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using HelpDesk.Helpers;

namespace HelpDesk.Services.MaintenanceService
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public MaintenanceService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<MaintenanceService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<MaintenanceDto>> GetAllAsync(MaintenanceFilterDto filter)
        {
            try
            {
                var query = _context.Maintenances
                    .Include(m => m.TypeMaintenance)
                    .Include(m => m.Area)
                    .Include(m => m.Device)
                    .AsQueryable();

                if (filter.IdMaintenanceType.HasValue)
                {
                    query = query.Where(m => m.IdMaintenanceType == filter.IdMaintenanceType.Value);
                }

                if (filter.IdArea.HasValue)
                {
                    query = query.Where(m => m.IdArea == filter.IdArea.Value);
                }

                if (filter.IdDevice.HasValue)
                {
                    query = query.Where(m => m.IdDevice == filter.IdDevice.Value);
                }

                if (!string.IsNullOrWhiteSpace(filter.Keyword))
                {
                    string term = filter.Keyword.Trim().ToLower();
                    query = query.Where(m => m.Details.ToLower().Contains(term));
                }

                if (filter.DateFrom.HasValue)
                {
                    query = query.Where(m => m.NotificationDate >= filter.DateFrom.Value);
                }

                if (filter.DateTo.HasValue)
                {
                    var endOfDay = filter.DateTo.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(m => m.NotificationDate <= endOfDay);
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var maintenancesDto = _mapper.Map<IEnumerable<MaintenanceDto>>(entities);

                return new PagedResponseDto<MaintenanceDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Listado de mantenimientos obtenido correctamente.",
                    Data = maintenancesDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el listado de mantenimientos.");
                return new PagedResponseDto<MaintenanceDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar el historial de mantenimientos."
                };
            }
        }

        public async Task<ResponseDto<MaintenanceDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Maintenances
                .Include(m => m.TypeMaintenance)
                .Include(m => m.Area)
                .Include(m => m.Device)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (entity == null)
            {
                return new ResponseDto<MaintenanceDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "El registro de mantenimiento no existe."
                };
            }

            return new ResponseDto<MaintenanceDto>
            {
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<MaintenanceDto>(entity)
            };
        }

        public async Task<ResponseDto<MaintenanceDto>> CreateAsync(CreateMaintenanceDto dto)
        {
            // Iniciamos una transacción para asegurar que ambos registros se guarden o ninguno
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var currentUserId = _authService.GetUserId();
                var currentDate = DateTime.Now;

                // 1. Mapear y crear la entidad principal (Mantenimiento)
                var maintenanceEntity = _mapper.Map<MaintenanceEntity>(dto);
                maintenanceEntity.CreatedBy = currentUserId;
                maintenanceEntity.CreatedDate = currentDate;

                // Calcular el tiempo de ejecución si no viene explícito
                if (maintenanceEntity.ExecutionTime <= 0)
                {
                    var duration = maintenanceEntity.CompletionDate - maintenanceEntity.NotificationDate;
                    maintenanceEntity.ExecutionTime = (decimal)duration.TotalHours;
                }

                _context.Maintenances.Add(maintenanceEntity);
                await _context.SaveChangesAsync(); // Guardamos para obtener el ID generado

                var device = await _context.Devices.FindAsync(maintenanceEntity.IdDevice);
                // 2. CREACIÓN AUTOMÁTICA DEL HISTORIAL
                var historyEntity = new MaintenanceHistoryEntity
                {
                    IdMaintenance = maintenanceEntity.Id, 
                    IdDevice = maintenanceEntity.IdDevice,
                    IdUser = maintenanceEntity.CreatedBy,  // El técnico que operó el sistema
                    IdTypeDevice = device!.IdDeviceType,
                    SolutionTime = maintenanceEntity.ExecutionTime,
                    CreatedBy = currentUserId,
                    CreatedDate = currentDate,
                };

                _context.MaintenanceHistories.Add(historyEntity);
                await _context.SaveChangesAsync();

                // Confirmamos la transacción de forma segura
                await transaction.CommitAsync();

                return await GetByIdAsync(maintenanceEntity.Id);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<ResponseDto<MaintenanceDto>> UpdateAsync(UpdateMaintenanceDto dto, long id)
        {
            var entity = await _context.Maintenances.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<MaintenanceDto> { Status = false, StatusCode = 404 };
            }

            _mapper.Map(dto, entity);

            // Auditoría de actualización
            entity.UpdatedBy = _authService.GetUserId();
            entity.UpdatedDate = DateTime.Now;

            _context.Maintenances.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.Maintenances.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            _context.Maintenances.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}