using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AlertConfigurationDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.NotificationDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AlertHistoryServices;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.EmailService;
using HelpDesk.Services.NotificationServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger _logger;
        private readonly IEmailService _emailService;

        public AlertConfigurationService(
            ApplicationDbContext context,
            IMapper mapper,
            IAuthService authService,
            INotificationService notificationService,
            IAlertHistoryService alertHistoryService,
            ILogger<AlertConfigurationService> logger,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _notificationService = notificationService;
            _alertHistoryService = alertHistoryService;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<PagedResponseDto<AlertConfigurationDto>> GetAllAsync(AlertConfigurationFilterDto filter)
        {
            try
            {
                var query = _context.AlertConfigurations
                    .Include(ac => ac.Areas)
                    .Include(ac => ac.Agencys)
                    .AsQueryable(); 

                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    string term = filter.SearchTerm.Trim().ToLower();

                    query = query.Where(ac => ac.Title.ToLower().Contains(term)
                                           || ac.Subject.ToLower().Contains(term)
                                           || ac.Description.ToLower().Contains(term));
                }

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(ac => ac.IsActive == filter.IsActive.Value);
                }

                if (filter.IsGlobal.HasValue)
                {
                    query = query.Where(ac => ac.IsGlobal == filter.IsGlobal.Value);
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var dtos = _mapper.Map<IEnumerable<AlertConfigurationDto>>(entities);

                return new PagedResponseDto<AlertConfigurationDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Configuraciones de alertas obtenidas correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las configuraciones de alertas.");
                return new PagedResponseDto<AlertConfigurationDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar las alertas."
                };
            }
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

            if (executorUserId == 0)
            {
                executorUserId = 1; 
            }

            var hasActiveTransaction = _context.Database.CurrentTransaction != null;
            using var transaction = hasActiveTransaction ? null : await _context.Database.BeginTransactionAsync();

            try
            {
                var config = await _context.AlertConfigurations
                    .Include(ac => ac.Areas)
                    .Include(ac => ac.Agencys)
                    .FirstOrDefaultAsync(ac => ac.Id == alertConfigurationId);

                if (config == null || !config.IsActive)
                {
                    return new ResponseDto<bool> { Status = false, StatusCode = 404, Message = "Configuración de alerta no encontrada o inactiva.", Data = false };
                }

                IQueryable<UserEntity> query = _context.Users.Where(u => u.IsActive);

                await _alertHistoryService.CreateAsync(config.Id, executorUserId);

                if (!config.IsGlobal)
                {
                    if (config.IdArea.HasValue)
                        query = query.Where(u => u.IdArea == config.IdArea.Value);

                    if (config.IdAgency.HasValue)
                        query = query.Where(u => u.IdAgency == config.IdAgency.Value);
                }

                var targetUsers = await query.ToListAsync();

                // 1. Notificaciones internas en la Base de Datos
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

                // Guardamos la auditoría en la DB
                await _alertHistoryService.CreateAsync(config.Id, executorUserId);

                // 2. Confirmamos la transacción en la Base de Datos
                if (transaction != null) await transaction.CommitAsync();

                // =========================================================================
                // 3. DISPARO DE ALERTAS POR CORREO ELECTRÓNICO (FUERA DE LA TRANSACCIÓN)
                // =========================================================================
                try
                {
                    string scopeText = config.IsGlobal
                        ? "Global (Toda la institución)"
                        : $"Específico - Área: {config.Areas?.NameArea ?? "N/A"} | Agencia: {config.Agencys?.Name ?? "N/A"}";

                    string emailHtml = EmailTemplates.GetAlertConfigurationTemplate(
                        config.Title,
                        config.Subject,
                        config.Description,
                        scopeText
                    );

                    // Enviamos el correo a cada uno de los usuarios que entraron en la segmentación
                    foreach (var user in targetUsers)
                    {
                        if (!string.IsNullOrWhiteSpace(user.Email))
                        {
                            await _emailService.SendEmailAsync(
                                user.Email,
                                $"🚨 [ALERTA TI] {config.Subject}",
                                emailHtml
                            );
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Si falla el servidor SMTP, lo logueamos pero la ejecución ya fue exitosa en la DB
                    _logger.LogError(ex, "La alerta #{ConfigId} se procesó en la DB, pero falló el envío masivo de correos.", config.Id);
                }

                return new ResponseDto<bool> { Status = true, StatusCode = 200, Message = "Alerta ejecutada y despachada con éxito.", Data = true };
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                _logger.LogError(ex, "Error crítico al ejecutar la alerta #{AlertConfigurationId}", alertConfigurationId);
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