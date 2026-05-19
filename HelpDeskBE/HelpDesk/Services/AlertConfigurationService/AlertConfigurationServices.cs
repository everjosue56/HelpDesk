using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AlertConfigurationDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.NotificationDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.AlertHistoryServices;
using HelpDesk.Services.NotificationServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.AlertConfigurationService
{
    public class AlertConfigurationService : IAlertConfigurationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly INotificationService _notificationService;
        private readonly IAlertHistoryService _alertHistoryService;

        public AlertConfigurationService(
            ApplicationDbContext context,
            IMapper mapper,
            IAuthService authService,
            INotificationService notificationService,
            IAlertHistoryService alertHistoryService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _notificationService = notificationService;
            _alertHistoryService = alertHistoryService;
        }

        public async Task<ResponseDto<IEnumerable<AlertConfigurationDto>>> GetAllAsync()
        {
            var entities = await _context.AlertConfigurations
                .Include(ac => ac.Areas)
                .Include(ac => ac.Agencys)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<AlertConfigurationDto>>(entities);
            return new ResponseDto<IEnumerable<AlertConfigurationDto>> { Status = true, StatusCode = 200, Data = dtos };
        }

        public async Task<ResponseDto<AlertConfigurationDto>> GetByIdAsync(long id)
        {
            var entity = await _context.AlertConfigurations
                .Include(ac => ac.Areas)
                .Include(ac => ac.Agencys)
                .FirstOrDefaultAsync(ac => ac.Id == id);

            if (entity == null)
            {
                return new ResponseDto<AlertConfigurationDto> 
                { Status = false, StatusCode = 404, Message = "Configuración de alerta no encontrada." };
            }

            return new ResponseDto<AlertConfigurationDto> 
            { Status = true, StatusCode = 200, Data = _mapper.Map<AlertConfigurationDto>(entity) };
        }

        public async Task<ResponseDto<AlertConfigurationDto>> CreateAsync(CreateAlertConfigurationDto dto)
        {
            var entity = _mapper.Map<AlertConfigurationEntity>(dto);

            if (entity.IsGlobal)
            {
                entity.IdArea = null;
                entity.IdAgency = null;
            }

            entity.CreatedBy = _authService.GetUserId();
            entity.CreatedDate = DateTime.Now;
            entity.IsActive = true;

            _context.AlertConfigurations.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<AlertConfigurationDto>> UpdateAsync(UpdateAlertConfigurationDto dto, long id)
        {
            var entity = await _context.AlertConfigurations.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<AlertConfigurationDto> { Status = false, StatusCode = 404, Message = "Configuración no encontrada." };
            }

            _mapper.Map(dto, entity);

            if (entity.IsGlobal)
            {
                entity.IdArea = null;
                entity.IdAgency = null;
            }

            entity.UpdatedBy = _authService.GetUserId();
            entity.UpdatedDate = DateTime.Now;

            _context.AlertConfigurations.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> ExecuteAlertAsync(long alertConfigurationId)
        {
            var executorUserId = _authService.GetUserId();
            var hasActiveTransaction = _context.Database.CurrentTransaction != null;
            using var transaction = hasActiveTransaction ? null : await _context.Database.BeginTransactionAsync();
           

            try
            {
                var config = await _context.AlertConfigurations.FindAsync(alertConfigurationId);
                if (config == null || !config.IsActive)
                {
                    return new ResponseDto<bool> { Status = false, StatusCode = 404, Message = "Configuración de alerta no encontrada o inactiva.", Data = false };
                }

                IQueryable<UserEntity> query = _context.Users.Where(u => u.IsActive);

                if (!config.IsGlobal)
                {
                    if (config.IdArea.HasValue)
                        query = query.Where(u => u.IdArea == config.IdArea.Value);

                    if (config.IdAgency.HasValue)
                        query = query.Where(u => u.IdAgency == config.IdAgency.Value);
                }

                var targetUsers = await query.ToListAsync();

                foreach (var user in targetUsers)
                {
                    var notificationDto = new CreateNotificationDto
                    {
                        IdUser = user.Id,
                        IdAlertType = 2,
                        TextMessage = $"[{config.Title}] {config.Description}",
                        IdReference = config.Id
                    };

                    await _notificationService.CreateAsync(notificationDto);
                }

                // Guardamos la auditoría
                await _alertHistoryService.CreateAsync(config.Id, config.CreatedBy);

                if (transaction != null) await transaction.CommitAsync();

                return new ResponseDto<bool> { Status = true, StatusCode = 200, Message = "Alerta ejecutada y despachada con éxito.", Data = true };
            }
            catch (Exception)
            {
                if (transaction != null) await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.AlertConfigurations.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            _context.AlertConfigurations.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}