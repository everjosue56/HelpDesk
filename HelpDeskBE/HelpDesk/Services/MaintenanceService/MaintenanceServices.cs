using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AlertConfigurationDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.DashboardDto;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceDto;
using HelpDesk.Dtos.NotificationDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AlertConfigurationService;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.EmailService;
using HelpDesk.Services.NotificationServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace HelpDesk.Services.MaintenanceService
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly IAlertConfigurationService _alertConfigService;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<MaintenanceService> _logger;

        public MaintenanceService(
            ApplicationDbContext context,
            IMapper mapper,
            IAlertConfigurationService alertConfigService,
            IEmailService emailService,
            INotificationService notificationService,
            IAuthService authService,
            ILogger<MaintenanceService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
            _notificationService = notificationService;
            _emailService = emailService;
        }

        public async Task<PagedResponseDto<MaintenanceDto>> GetAllAsync(MaintenanceFilterDto filter)
        {
            try
            {
                var query = _context.Maintenances
                    .Include(m => m.TypeMaintenance)
                    .Include(m => m.MaintenanceFrequencies) 
                    .Include(m => m.Area)
                    .Include(m => m.Device)
                    .OrderByDescending(m => m.CreatedDate)
                    .Where(m => !m.IsDeleted)
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
                .Include(m => m.MaintenanceFrequencies)  
                .Include(m => m.Area)
                .Include(m => m.Device)
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

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
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var currentUserId = _authService.GetUserId();
                var currentDate = DateTime.Now;

                // 1. Guardar Mantenimiento principal
                var maintenanceEntity = _mapper.Map<MaintenanceEntity>(dto);
                maintenanceEntity.CreatedBy = currentUserId;
                maintenanceEntity.CreatedDate = currentDate;

                if (maintenanceEntity.ExecutionTime <= 0 && maintenanceEntity.CompletionDate > maintenanceEntity.NotificationDate)
                {
                    var duration = maintenanceEntity.CompletionDate - maintenanceEntity.NotificationDate;
                    maintenanceEntity.ExecutionTime = (decimal)duration.TotalHours;
                }

                _context.Maintenances.Add(maintenanceEntity);
                await _context.SaveChangesAsync();

                var device = await _context.Devices.FindAsync(maintenanceEntity.IdDevice);
                var deviceName = device?.BrandName ?? "Equipo de cómputo";

                // 2. Historial de Mantenimiento
                var historyEntity = new MaintenanceHistoryEntity
                {
                    IdMaintenance = maintenanceEntity.Id,
                    IdDevice = maintenanceEntity.IdDevice,
                    IdUser = currentUserId,
                    IdTypeDevice = device?.IdDeviceType ?? 1,
                    SolutionTime = maintenanceEntity.ExecutionTime,
                    CreatedBy = currentUserId,
                    CreatedDate = currentDate,
                    IsDeleted = false
                };

                _context.MaintenanceHistories.Add(historyEntity);
                await _context.SaveChangesAsync();

                // 3. PROGRAMAR ALERTAS FUTURAS (2 Días Antes y Mismo Día)
                var maintenanceDate = maintenanceEntity.CompletionDate;
                var twoDaysBefore = maintenanceDate.AddDays(-2).Date.AddHours(8);
                var sameDayDate = maintenanceDate.Date.AddHours(8);

                if (_alertConfigService != null)
                {
                    // Alerta 1: 2 días antes
                    if (twoDaysBefore >= DateTime.Today)
                    {
                        await _alertConfigService.CreateAsync(new CreateAlertConfigurationDto
                        {
                            Title = "Mantenimiento Preventivo Próximo (2 días)",
                            Subject = $"Recordatorio: Mantenimiento para {deviceName} en 2 días",
                            Description = $"El equipo '{deviceName}' tiene mantenimiento programado para el {maintenanceDate:dd/MM/yyyy}.",
                            IsGlobal = false,
                            IsActive = true,
                            IdArea = maintenanceEntity.IdArea > 0 ? maintenanceEntity.IdArea : null,
                            ScheduledDate = twoDaysBefore
                        });
                    }

                    // Alerta 2: Mismo día del mantenimiento
                    if (sameDayDate >= DateTime.Today)
                    {
                        await _alertConfigService.CreateAsync(new CreateAlertConfigurationDto
                        {
                            Title = "Mantenimiento Preventivo HOY",
                            Subject = $"¡HOY! Mantenimiento Programado: {deviceName}",
                            Description = $"El equipo '{deviceName}' debe recibir mantenimiento el día de hoy ({maintenanceDate:dd/MM/yyyy}).",
                            IsGlobal = false,
                            IsActive = true,
                            IdArea = maintenanceEntity.IdArea > 0 ? maintenanceEntity.IdArea : null,
                            ScheduledDate = sameDayDate
                        });
                    }
                }

                // 4. DISPARAR NOTIFICACIÓN INTERNA INMEDIATA 
                var createNotificationDto = new CreateNotificationDto
                {
                    IdUser = currentUserId,
                    IdAlertType = 2, 
                    TextMessage = $"El mantenimiento preventivo para el equipo {deviceName} ha sido programado con éxito.",
                    IdReference = maintenanceEntity.Id
                };
                await _notificationService.CreateAsync(createNotificationDto);

                // --------------------------------
                // 5. CONFIRMAR TODO EN SQL SERVER
                // --------------------------------
                await transaction.CommitAsync();

                // =========================================================================
                // 6. FLUJO DE CORREOS AUTOMÁTICOS INMEDIATOS (FUERA DE LA TRANSACCIÓN)
                // =========================================================================
                try
                {
                    var maintenanceInfo = await _context.Maintenances
                        .IgnoreQueryFilters()
                        .Include(m => m.Area)
                        .Include(m => m.Device)
                        .Include(m => m.MaintenanceFrequencies)
                        .FirstOrDefaultAsync(m => m.Id == maintenanceEntity.Id);

                    if (maintenanceInfo != null)
                    {
                        // Extraer correos de los técnicos (Roles 1 y 2)
                        var tiEmails = await _context.Users
                            .Where(u => u.IdRol == 1 || u.IdRol == 2)
                            .Select(u => u.Email)
                            .ToListAsync();

                        deviceName = maintenanceInfo.Device?.BrandName ?? deviceName;
                        string areaName = maintenanceInfo.Area?.NameArea ?? "Área General";
                        string frequencyName = maintenanceInfo.MaintenanceFrequencies?.Name ?? "No Especificada";
                        string formattedDate = maintenanceEntity.CompletionDate.ToString("dd/MM/yyyy hh:mm tt");

                        string emailHtml = HelpDesk.Helpers.EmailTemplates.GetMaintenanceScheduledTemplate(
                            maintenanceInfo.Id,
                            deviceName,
                            areaName,
                            frequencyName,
                            formattedDate,
                            maintenanceEntity.ExecutionTime.ToString("0"),
                            maintenanceEntity.Details
                        );

                        string emailSubject = $"🔧 [HelpDesk] Mantenimiento Preventivo Programado: {deviceName} (#{maintenanceInfo.Id})";   

                        foreach (var tiEmail in tiEmails)
                        {
                            await _emailService.SendEmailAsync(tiEmail, emailSubject, emailHtml);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "El mantenimiento #{MaintenanceId} se guardó, pero falló el envío del correo electrónico de confirmación.", maintenanceEntity.Id);
                }
                // =========================================================================

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

            if (entity == null || entity.IsDeleted)
            {
                return new ResponseDto<MaintenanceDto> { Status = false, StatusCode = 404, Message = "Registro no encontrado." };
            }

            _mapper.Map(dto, entity);

            entity.UpdatedBy = _authService.GetUserId();
            entity.UpdatedDate = DateTime.Now;

            _context.Maintenances.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var entity = await _context.Maintenances.FindAsync(id);

                if (entity == null || entity.IsDeleted)
                {
                    return new ResponseDto<bool>
                    {
                        Status = false,
                        StatusCode = 404,
                        Message = "Mantenimiento no encontrado.",
                        Data = false
                    };
                }

                entity.IsDeleted = true;
                entity.UpdatedBy = _authService.GetUserId();
                entity.UpdatedDate = DateTime.Now;

                _context.Maintenances.Update(entity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Mantenimiento eliminado correctamente.",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar mantenimiento con ID {Id}.", id);
                return new ResponseDto<bool>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error al procesar la eliminación.",
                    Data = false
                };
            }
        }

        public async Task ProcessUpcomingMaintenanceAlertsAsync()
        {
            var targetDate1 = DateTime.Today.AddDays(2); 
            var targetDate2 = DateTime.Today;         

            var upcomingMaintenances = await _context.Maintenances
                .Include(m => m.Device)
                .Where(m => !m.IsDeleted &&
                           (m.NotificationDate.Date == targetDate1 || m.NotificationDate.Date == targetDate2))
                .ToListAsync();

            foreach (var maintenance in upcomingMaintenances)
            {
                 
            }
        }



        public async Task<ResponseDto<MaintenanceDto>> RenewAsync(long maintenanceId, RenewMaintenanceDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
             
                var maintenance = await _context.Maintenances
                    .Include(m => m.Device) 
                    .Include(m => m.Area)  
                    .FirstOrDefaultAsync(m => m.Id == maintenanceId && !m.IsDeleted);

                if (maintenance == null)
                {
                    return new ResponseDto<MaintenanceDto> { Status = false, StatusCode = 404, Message = "Mantenimiento no encontrado." };
                }

                var currentUserId = _authService.GetUserId();
                var currentDate = DateTime.Now;
                

                // 2. GUARDAMOS LA EJECUCIÓN EN EL "ARREGLO" (Historial)
                var historyEntity = new MaintenanceHistoryEntity
                {
                    IdMaintenance = maintenance.Id,
                    IdDevice = maintenance.IdDevice,
                    IdUser = currentUserId,
                    IdTypeDevice = maintenance.Device?.IdDeviceType ?? 1,
                    SolutionTime = dto.ExecutionTime,
                    CreatedBy = currentUserId,
                    CreatedDate = currentDate,
                    IsDeleted = false
                };
                _context.MaintenanceHistories.Add(historyEntity);

                // 3. ACTUALIZAMOS EL REGISTRO MAESTRO PARA LA PRÓXIMA VEZ
                maintenance.NotificationDate = dto.NotificationDate;
                maintenance.CompletionDate = dto.CompletionDate;
                maintenance.Details = dto.Details;
                maintenance.ExecutionTime = dto.ExecutionTime;
                maintenance.UpdatedBy = currentUserId;
                maintenance.UpdatedDate = currentDate;

                _context.Maintenances.Update(maintenance);
                await _context.SaveChangesAsync();


                // 4. CREAR LAS NUEVAS ALERTAS FUTURAS PARA EL WORKER (2 Días Antes y Mismo Día)
                var nextMaintenanceDate = dto.CompletionDate;
                var twoDaysBefore = nextMaintenanceDate.AddDays(-2).Date.AddHours(8);
                var sameDayDate = nextMaintenanceDate.Date.AddHours(8);
                var targetDeviceName = maintenance.Device?.BrandName ?? "Equipo";

                if (_alertConfigService != null)
                {
                    // Alerta 1: 2 días antes
                    if (twoDaysBefore >= DateTime.Today)
                    {
                        await _alertConfigService.CreateAsync(new CreateAlertConfigurationDto
                        {
                            Title = "Mantenimiento Preventivo Próximo (2 días)",
                            Subject = $"Recordatorio: Mantenimiento para {targetDeviceName} en 2 días",
                            Description = $"El equipo '{targetDeviceName}' tiene mantenimiento programado para el {nextMaintenanceDate:dd/MM/yyyy}.",
                            IsGlobal = false,
                            IsActive = true,
                            IdArea = maintenance.IdArea > 0 ? maintenance.IdArea : null,
                            ScheduledDate = twoDaysBefore
                        });
                    }

                    // Alerta 2: Mismo día del mantenimiento
                    if (sameDayDate >= DateTime.Today)
                    {
                        await _alertConfigService.CreateAsync(new CreateAlertConfigurationDto
                        {
                            Title = "Mantenimiento Preventivo HOY",
                            Subject = $"¡HOY! Mantenimiento Programado: {targetDeviceName}",
                            Description = $"El equipo '{targetDeviceName}' debe recibir mantenimiento el día de hoy ({nextMaintenanceDate:dd/MM/yyyy}).",
                            IsGlobal = false,
                            IsActive = true,
                            IdArea = maintenance.IdArea > 0 ? maintenance.IdArea : null,
                            ScheduledDate = sameDayDate
                        });
                    }
                }

                await transaction.CommitAsync();

                // =========================================================================
                // 5. FLUJO DE CORREOS AUTOMÁTICOS INMEDIATOS (FUERA DE LA TRANSACCIÓN)
                // =========================================================================
                try
                {
                    var maintenanceInfo = await _context.Maintenances
                        .IgnoreQueryFilters()
                        .Include(m => m.Area)
                        .Include(m => m.Device)
                        .Include(m => m.MaintenanceFrequencies) 
                        .FirstOrDefaultAsync(m => m.Id == maintenance.Id);

                    if (maintenanceInfo != null)
                    {
                        // Extraer correos de los técnicos (Roles 1 y 2)
                        var tiEmails = await _context.Users
                            .Where(u => u.IdRol == 1 || u.IdRol == 2)
                            .Select(u => u.Email)
                            .ToListAsync();

                    
                        string deviceName = maintenanceInfo.Device?.BrandName ?? "Equipo de Cómputo";
                        string areaName = maintenanceInfo.Area?.NameArea ?? "Área General";
                        string frequencyName = maintenanceInfo.MaintenanceFrequencies?.Name ?? "No Especificada";
                        string formattedDate = maintenanceInfo.CompletionDate.ToString("dd/MM/yyyy hh:mm tt");


                        var createNotificationDto = new CreateNotificationDto
                        {
                            IdUser = currentUserId,
                            IdAlertType = 2,
                            TextMessage = $"El mantenimiento preventivo para el equipo {deviceName} ha sido programado con éxito.",
                            IdReference = maintenance.Id
                        };
                        await _notificationService.CreateAsync(createNotificationDto);

                        // --------------------------------
                        // 5. CONFIRMAR TODO EN SQL SERVER
                        // --------------------------------

                        string emailHtml = HelpDesk.Helpers.EmailTemplates.GetMaintenanceScheduledTemplate(
                            maintenanceInfo.Id,
                            deviceName,
                            areaName,
                            frequencyName,
                            formattedDate,
                            maintenanceInfo.ExecutionTime.ToString("0"), 
                            maintenanceInfo.Details
                        );

                        string emailSubject = $"🔄 [HelpDesk] Mantenimiento Renovado y Programado: {deviceName} (#{maintenanceInfo.Id})";

                        foreach (var tiEmail in tiEmails)
                        {
                            await _emailService.SendEmailAsync(tiEmail, emailSubject, emailHtml);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "La renovación del mantenimiento #{MaintenanceId} se guardó, pero falló el envío del correo electrónico.", maintenance.Id);
                }
                // =========================================================================

                // Retornamos el MISMO mantenimiento, pero con las fechas y datos actualizados
                return await GetByIdAsync(maintenance.Id);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<ResponseDto<List<MaintenanceCalendarDto>>> GetMaintenanceCalendarAsync(int? year, int? month)
        {
            try
            {
                var targetYear = year ?? DateTime.Now.Year;
                var targetMonth = month ?? DateTime.Now.Month;
                var today = DateTime.Today;

                // 1. Obtener mantenimientos e historial de mantenimientos de la base de datos
                var maintenances = await _context.Maintenances
                    .IgnoreQueryFilters()
                    .Include(m => m.Device)
                    .Include(m => m.MaintenanceFrequencies)
                    .Where(m => !m.IsDeleted)
                    .ToListAsync();

                var histories = await _context.MaintenanceHistories
                    .Where(h => !h.IsDeleted)
                    .ToListAsync();

                var events = new List<MaintenanceCalendarDto>();

                foreach (var m in maintenances)
                {
                    // 2. Determinar la cantidad de meses según la frecuencia
                    int monthsToAdd = m.IdMaintenanceFrequency switch
                    {
                        1 => 1,  // Mensual
                        2 => 3,  // Trimestral
                        3 => 6,  // Semestral
                        4 => 12, // Anual
                        _ => 1
                    };

                    // 3. Proyectar la fecha hacia el mes y año consultados (tanto hacia adelante como hacia atrás)
                    DateTime projectedDate = m.CompletionDate;

                    // Si la fecha objetivo está en el pasado respecto a CompletionDate, retrocedemos
                    while (projectedDate.Year > targetYear || (projectedDate.Year == targetYear && projectedDate.Month > targetMonth))
                    {
                        projectedDate = projectedDate.AddMonths(-monthsToAdd);
                    }

                    // Si la fecha objetivo está en el futuro respecto a CompletionDate, avanzamos
                    while (projectedDate.Year < targetYear || (projectedDate.Year == targetYear && projectedDate.Month < targetMonth))
                    {
                        projectedDate = projectedDate.AddMonths(monthsToAdd);
                    }

                    // 4. Si la fecha proyectada cae exactamente en el mes y año que el usuario está consultando
                    if (projectedDate.Year == targetYear && projectedDate.Month == targetMonth)
                    {
                        int daysDiff = (projectedDate.Date - today).Days;

                        string status;
                        string color;

                        // Verificar si existe historial de ejecución para este mantenimiento en este periodo
                        bool hasHistoryForPeriod = histories.Any(h => h.IdMaintenance == m.Id &&
                            ((h.CreatedDate.Year == projectedDate.Year && h.CreatedDate.Month == projectedDate.Month) ||
                             Math.Abs((h.CreatedDate.Date - projectedDate.Date).Days) <= 15));

                        if (hasHistoryForPeriod || (projectedDate.Date < today && m.UpdatedDate.HasValue && m.UpdatedDate.Value.Date == projectedDate.Date))
                        {
                            status = "Realizado";
                            color = "green"; // VERDE: Ejecutado y registrado en el historial
                        }
                        else if (daysDiff < 0)
                        {
                            status = "Vencido";
                            color = "red"; // ROJO: Pasó la fecha sin renovar
                        }
                        else if (daysDiff >= 0 && daysDiff <= 7)
                        {
                            status = "Proximo";
                            color = "yellow"; // AMARILLO: Entre 0 y 7 días
                        }
                        else
                        {
                            status = "Programado";
                            color = "blue"; // AZUL: A más de 7 días
                        }

                        var executionHours = m.ExecutionTime > 0 ? (double)m.ExecutionTime : 1.0;

                        events.Add(new MaintenanceCalendarDto
                        {
                            Id = m.Id,
                            Title = $"{m.Device?.BrandName ?? "Equipo"} ({m.MaintenanceFrequencies?.Name ?? "Mantenimiento"})",
                            Start = projectedDate,
                            End = projectedDate.AddHours(executionHours),
                            Details = m.Details ?? string.Empty,
                            DeviceName = m.Device?.BrandName ?? "N/A",
                            FrequencyName = m.MaintenanceFrequencies?.Name ?? "Regular",
                            Status = status,
                            Color = color
                        });
                    }
                }

                return new ResponseDto<List<MaintenanceCalendarDto>>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Eventos de calendario obtenidos correctamente.",
                    Data = events
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al recuperar los eventos del calendario de mantenimiento.");
                return new ResponseDto<List<MaintenanceCalendarDto>>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error al obtener los datos para el calendario."
                };
            }
        }

        public async Task<ResponseDto<MaintenanceDashboardDataDto>> GetDashboardStatsAsync(int year, int? month)
        {
            try
            {
                var today = DateTime.Today;

                // 1. OBTENER EJECUCIONES REALES (Historial)
                var historyQuery = _context.MaintenanceHistories
                    .IgnoreQueryFilters()
                    .Include(mh => mh.Maintenances)  
                        .ThenInclude(m => m.Area)
                    .Include(mh => mh.Maintenances)
                        .ThenInclude(m => m.MaintenanceFrequencies)
                    .Where(mh => !mh.IsDeleted && mh.CreatedDate.Year == year);

                if (month.HasValue && month.Value > 0)
                {
                    historyQuery = historyQuery.Where(mh => mh.CreatedDate.Month == month.Value);
                }

                var completedList = await historyQuery.ToListAsync();

                // 2. OBTENER PLAN MAESTRO ACTIVO (Programados/Vencidos)
                var maintenanceQuery = _context.Maintenances
                    .IgnoreQueryFilters()
                    .Include(m => m.Area)
                    .Include(m => m.MaintenanceFrequencies)
                    .Where(m => !m.IsDeleted);

                if (month.HasValue && month.Value > 0)
                {
                    maintenanceQuery = maintenanceQuery.Where(m => m.CompletionDate.Month == month.Value && m.CompletionDate.Year == year);
                }

                var scheduledList = await maintenanceQuery.ToListAsync();

                // 3. CÁLCULOS ESTRICTAMENTE SEPARADOS
                int realizados = completedList.Count; // Total de intervenciones físicas reales
                int vencidos = scheduledList.Count(m => (m.CompletionDate.Date - today).Days < 0);
                int proximos = scheduledList.Count(m => {
                    int diff = (m.CompletionDate.Date - today).Days;
                    return diff >= 0 && diff <= 7;
                });
                int programados = scheduledList.Count(m => (m.CompletionDate.Date - today).Days > 7);
                int totalProgramados = scheduledList.Count; // El universo total de equipos en el plan

                double tiempoTotal = completedList.Sum(mh => (double)mh.SolutionTime) / 60.0;

                // 4. GRÁFICOS DE ÁREA Y FRECUENCIA (Basado SOLO en el plan maestro para NO duplicar)
                var porFrecuencia = scheduledList
                    .GroupBy(m => m.MaintenanceFrequencies?.Name ?? "No Especificada")
                    .Select(g => new MaintenanceFrequencyChartDto { Frecuencia = g.Key, Cantidad = g.Count() })
                    .ToList();

                var porArea = scheduledList
                    .GroupBy(m => m.Area?.NameArea ?? "Área General")
                    .Select(g => new MaintenanceAreaChartDto { Area = g.Key, Cantidad = g.Count() })
                    .ToList();

                // 5. HISTORIAL MENSUAL (Basado SOLO en el trabajo ejecutado)
                var historialMensual = completedList
                    .GroupBy(mh => mh.CreatedDate.Month)
                    .OrderBy(g => g.Key)
                    .Select(g => new MaintenanceMonthlyHistoryDto
                    {
                        MesNumero = g.Key,
                        MesNombre = new DateTime(year, (int)g.Key, 1)
                            .ToString("MMMM", new System.Globalization.CultureInfo("es-ES")),
                        Cantidad = g.Count()
                    })
                    .ToList();

                // 6. DTO FINAL
                var dashboardData = new MaintenanceDashboardDataDto
                {
                    TotalProgramados = totalProgramados, // Lo que debe hacerse
                    TotalRealizados = realizados,        // Lo que ya se hizo
                    TotalVencidos = vencidos,            // Lo que se olvidó hacer
                    TiempoTotalEjecucion = tiempoTotal,
                    PorFrecuencia = porFrecuencia,
                    PorArea = porArea,
                    HistorialMensual = historialMensual,
                    PorEstado = new List<MaintenanceStatusDto>
            {
                new MaintenanceStatusDto { Estado = "Realizado", Cantidad = realizados, Color = "green" },
                new MaintenanceStatusDto { Estado = "Vencido", Cantidad = vencidos, Color = "red" },
                new MaintenanceStatusDto { Estado = "Proximo", Cantidad = proximos, Color = "yellow" },
                new MaintenanceStatusDto { Estado = "Programado", Cantidad = programados, Color = "blue" }
            }
                };

                return new ResponseDto<MaintenanceDashboardDataDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Data = dashboardData,
                    Message = "Dashboard generado con éxito"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al generar métricas del dashboard de mantenimiento.");
                return new ResponseDto<MaintenanceDashboardDataDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno al generar las métricas del dashboard."
                };
            }
        }

    }
}