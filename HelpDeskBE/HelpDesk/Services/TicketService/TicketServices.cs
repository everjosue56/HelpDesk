using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.NotificationDto; 
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.EmailService;
using HelpDesk.Services.NotificationService;
using HelpDesk.Services.NotificationServices;
using HelpDesk.Services.TicketService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class TicketServices : ITicketService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public readonly IAuthService _authService;
        private readonly INotificationService _notificationService;
        private readonly ILogger _logger;
        private readonly IEmailService _emailService;

        public TicketServices(
            ApplicationDbContext context,
            IMapper mapper,
            IAuthService authService,
            INotificationService notificationService,
            ILogger<TicketServices> logger,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _notificationService = notificationService;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<PagedResponseDto<TicketDto>> GetAllAsync(TicketFilterDto filter, bool isCliente, long currentUserId)
        {
            try
            {
 
                if (isCliente)
                {
                    filter.IdUser = currentUserId;  
                }

                // 1. Base query utilizando AsNoTracking para optimizar el rendimiento y la velocidad
                var query = _context.Tickets
                    .AsNoTracking()
                    .IgnoreQueryFilters()
                    .Include(t => t.User)
                    .Include(t => t.TypeError)
                    .Include(t => t.Area)
                    .Include(t => t.SoftwareSystem)
                    .Include(t => t.Impact)
                    .Include(t => t.Priority)
                    .Include(t => t.SolutionStatus)
                    .Include(t => t.AssignedUser)
                    .OrderByDescending(t => t.CreatedDate)
                    .Where(t => t.IsActive && !t.IsDeleted);

                // ─── FILTROS DINÁMICOS EXISTENTES ─── 
                if (filter.IdUser.HasValue)
                    query = query.Where(t => t.IdUser == filter.IdUser.Value);

                if (filter.IdTypeError.HasValue)
                    query = query.Where(t => t.IdTypeError == filter.IdTypeError.Value);

                if (filter.IdArea.HasValue)
                    query = query.Where(t => t.IdArea == filter.IdArea.Value);

                if (filter.IdSoftwareSystem.HasValue)
                    query = query.Where(t => t.IdSoftwareSystem == filter.IdSoftwareSystem.Value);

                if (filter.IdImpact.HasValue)
                    query = query.Where(t => t.IdImpact == filter.IdImpact.Value);

                if (filter.IdPriority.HasValue)
                    query = query.Where(t => t.IdPriority == filter.IdPriority.Value);

                if (!string.IsNullOrWhiteSpace(filter.Keyword))
                {
                    string term = filter.Keyword.Trim().ToLower();
                    query = query.Where(t => t.Description.ToLower().Contains(term));
                }

                if (filter.DateFrom.HasValue)
                {
                    query = query.Where(t => t.ReportDate >= filter.DateFrom.Value);
                }

                if (filter.DateTo.HasValue)
                {
                    var endOfDay = filter.DateTo.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(t => t.ReportDate <= endOfDay);
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var today = DateTime.Today;
                int finalActiveCount = 0;
                int finalResolvedCount = 0;

                if (isCliente)
                {

                    finalActiveCount = await _context.Tickets
                        .AsNoTracking()
                        .IgnoreQueryFilters()
                        .CountAsync(t => t.IdUser == currentUserId && t.IsActive && !t.IsDeleted);

                    finalResolvedCount = await _context.Tickets
                        .AsNoTracking()
                        .IgnoreQueryFilters()
                        .CountAsync(t => t.IdUser == currentUserId && !t.IsDeleted);
                }
                else
                {
             
                    finalActiveCount = await _context.Tickets
                        .AsNoTracking()
                        .IgnoreQueryFilters()
                        .CountAsync(t => t.IsActive && !t.IsDeleted);

                    finalResolvedCount = await _context.Tickets
                        .AsNoTracking()
                        .IgnoreQueryFilters()
                        .CountAsync(t => !t.IsActive && !t.IsDeleted && t.UpdatedDate >= today);
                }

                var notificationsDto = _mapper.Map<IEnumerable<TicketDto>>(entities);

                return new PagedResponseDto<TicketDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Listado de tickets obtenido correctamente.",
                    Data = notificationsDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages,

                    
                    ActiveTicketsCount = finalActiveCount,
                    ResolvedTodayCount = finalResolvedCount
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el listado de tickets paginado.");
                return new PagedResponseDto<TicketDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los tickets."
                };
            }
        }

        public async Task<ResponseDto<TicketDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Tickets
                .IgnoreQueryFilters()
                .Include(t => t.User)
                .Include(t => t.TypeError)
                .Include(t => t.Area)
                .Include(t => t.SoftwareSystem)
                .Include(t => t.Impact)
                .Include(t => t.Priority)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (entity == null)
            {
                return new ResponseDto<TicketDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Ticket no encontrado."
                };
            }

            return new ResponseDto<TicketDto>
            {
                Status = true,
                Data = _mapper.Map<TicketDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<TicketDto>> CreateAsync(CreateTicketDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var entity = _mapper.Map<TicketEntity>(dto);
                var currentUserId = _authService.GetUserId();
                var currentDate = DateTime.Now;

                // Asignación de datos automáticos del Ticket
                entity.ReportDate = currentDate;
                entity.CreatedDate = currentDate;
                entity.CreatedBy = currentUserId;
                entity.IdUser = currentUserId;
                entity.IdArea = dto.IdArea;
                entity.IsActive = true;
                entity.IsDeleted = false;
                _context.Tickets.Add(entity);
                await _context.SaveChangesAsync();

                // ----------------------------------------------
                // 1. DISPARAR EL SERVICIO DE NOTIFICACIONES INTERNAS
                // ----------------------------------------------
                var createNotificationDto = new CreateNotificationDto
                {
                    IdUser = entity.IdUser,
                    IdAlertType = 2,
                    TextMessage = $"Tu Ticket #{entity.Id} ha sido creado exitosamente. Pronto un técnico tomará tu caso.",
                    IdReference = entity.Id
                };
                await _notificationService.CreateAsync(createNotificationDto);

                // --------------------------------
                // 2. CONFIRMAR TODO EN SQL SERVER
                // --------------------------------
                await transaction.CommitAsync();

                // =========================================================================
                // 3. FLUJO DE CORREOS AUTOMÁTICOS (FUERA DE LA TRANSACCIÓN)
                // =========================================================================
                try
                {
                    var ticketInfo = await _context.Tickets
                        .IgnoreQueryFilters()
                        .Include(t => t.User)
                        .Include(t => t.Area)
                        .Include(t => t.SoftwareSystem)
                        .Include(t => t.Priority)
                        .FirstOrDefaultAsync(t => t.Id == entity.Id);

                    if (ticketInfo != null)
                    {
                        string fullName = $"{ticketInfo.User.FirstName} {ticketInfo.User.LastName}";

                        // A. Correo al Cliente (La plantilla que ya tenías)
                        string clientHtml = HelpDesk.Helpers.EmailTemplates.GetTicketCreationTemplate(
                            fullName,
                            ticketInfo.Id,
                            ticketInfo.Area.NameArea,
                            ticketInfo.SoftwareSystem.Name,
                            ticketInfo.Priority.Name,
                            ticketInfo.Description
                        );

                        await _emailService.SendEmailAsync(
                            ticketInfo.User.Email,
                            $"[Financiera Codimersa] Ticket #{ticketInfo.Id} registrado con éxito",
                            clientHtml
                        );

                        // 🚀 B. NUEVA LÓGICA: Correo específico a los encargados de TI
                        string tiHtml = HelpDesk.Helpers.EmailTemplates.GetTiNotificationTemplate(
                            fullName,
                            ticketInfo.Id,
                            ticketInfo.Area.NameArea,
                            ticketInfo.SoftwareSystem.Name,
                            ticketInfo.Priority.Name,
                            ticketInfo.Description
                        );

                        var tiEmails = await _context.Users
                            .Where(u => u.IdRol == 1 || u.IdRol == 2)
                            .Select(u => u.Email)
                            .ToListAsync();

                        string tiSubject = $"⚠️ ACCIÓN REQUERIDA: Ticket #{ticketInfo.Id} - Área: {ticketInfo.Area.NameArea}";

                        foreach (var tiEmail in tiEmails)
                        {
                            // Ahora mandamos el 'tiHtml' en lugar del 'clientHtml'
                            await _emailService.SendEmailAsync(tiEmail, tiSubject, tiHtml);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "El ticket #{TicketId} se guardó, pero falló el envío de alertas por correo electrónico.", entity.Id);
                }
                // =========================================================================

                // Retornamos la respuesta del ticket recién creado
                return await GetByIdAsync(entity.Id);
            }
            catch (Exception)
            {
                // Si algo truena en la cadena, revertimos todo para evitar datos huérfanos
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<ResponseDto<TicketDto>> UpdateAsync(UpdateTicketDto dto, long id)
        {
            var entity = await _context.Tickets.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<TicketDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: el ticket no existe."
                };
            }

            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Tickets.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var entity = await _context.Tickets.FindAsync(id);

                if (entity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Ticket no encontrado.", Data = false };
                }

                entity.IsDeleted = true;
                entity.IsActive = false;

                _context.Tickets.Update(entity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Ticket desactivado correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar ticket.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la desactivacion.", Data = false };
            }
        }

        public async Task<ResponseDto<bool>> ClaimTicketAsync(long ticketId)
        {
            try
            {
                // 1. Buscar el ticket en la base de datos
                var ticket = await _context.Tickets.FindAsync(ticketId);

                if (ticket == null)
                {
                    return new ResponseDto<bool>
                    {
                        Status = false,
                        StatusCode = 404,
                        Message = "El ticket especificado no existe."
                    };
                }

                // 2. Validar que no haya sido tomado o resuelto previamente
                // (IdSolutionState == 3 significa "Pendiente")
                if (ticket.IdUserAssigned.HasValue || ticket.IdSolutionState != 3)
                {
                    return new ResponseDto<bool>
                    {
                        Status = false,
                        StatusCode = 400,
                        Message = "Este ticket ya está en proceso o ha sido resuelto por otro técnico."
                    };
                }

                // 3. Obtener el ID del técnico que está logueado actualmente en el sistema
                var currentUserId = _authService.GetUserId();

                // 4. Asignar el técnico y cambiar el estado de la solución a "En Proceso" (ID: 2)
                ticket.IdUserAssigned = currentUserId;
                ticket.IdSolutionState = 2; // 2 = "En Proceso"
                ticket.UpdatedBy = currentUserId;
                ticket.UpdatedDate = DateTime.Now;

                _context.Tickets.Update(ticket);
                await _context.SaveChangesAsync();

                // 5. Disparar una notificación interna al cliente que reportó el problema
                try
                {
                    var createNotificationDto = new CreateNotificationDto
                    {
                        IdUser = ticket.IdUser, // ID del cliente
                        IdAlertType = 2, // Alerta de Soporte
                        TextMessage = $"Tu Ticket #{ticket.Id} ha sido tomado por el equipo de TI y ya se encuentra 'En Proceso' de resolución.",
                        IdReference = ticket.Id
                    };
                    await _notificationService.CreateAsync(createNotificationDto);
                }
                catch (Exception ex)
                {
                    // Si la notificación llega a fallar por alguna razón, logueamos el error
                    // pero no interrumpimos la respuesta exitosa para el técnico de TI.
                    _logger.LogError(ex, "El ticket #{TicketId} fue tomado, pero falló el envío de la notificación al cliente.", ticketId);
                }

                return new ResponseDto<bool>
                {
                    Status = true,
                    StatusCode = 200,
                    Data = true,
                    Message = "Has tomado el ticket con éxito. Ya puedes trabajar en su solución."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar tomar el ticket {TicketId}", ticketId);
                return new ResponseDto<bool>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Ocurrió un error interno en el servidor al intentar procesar la solicitud."
                };
            }
        }
    }
}