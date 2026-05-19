using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.MaintenanceDto;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.MaintenanceService
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public MaintenanceService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<MaintenanceDto>>> GetAllAsync()
        {
            var entities = await _context.Maintenances
                .Include(m => m.TypeMaintenance)
                .Include(m => m.Area)
                .Include(m => m.Device)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<MaintenanceDto>>(entities);

            return new ResponseDto<IEnumerable<MaintenanceDto>>
            {
                Status = true,
                StatusCode = 200,
                Data = dtos
            };
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