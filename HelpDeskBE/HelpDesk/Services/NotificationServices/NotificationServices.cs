using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.NotificationDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.NotificationServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.NotificationService
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public NotificationService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<NotificationService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<NotificationDto>> GetAllAsync(NotificationFilterDto filter, bool isCliente, int currentUserId)
        {
            try
            {

                if (isCliente)
                {
                    filter.IdUser = currentUserId;
                }

                var query = _context.Notifications
                    .Include(n => n.Users)
                    .Include(n => n.AlertTypes)
                    .OrderByDescending(n => n.CreatedDate)
                    .AsQueryable();

                if (filter.IdUser.HasValue)
                {
                    query = query.Where(n => n.IdUser == filter.IdUser.Value);
                }

                if (filter.IdAlertType.HasValue)
                {
                    query = query.Where(n => n.IdAlertType == filter.IdAlertType.Value);
                }

                if (filter.IsRead.HasValue)
                {
                    query = query.Where(n => n.IsRead == filter.IsRead.Value);
                }

                if (!string.IsNullOrWhiteSpace(filter.Keyword))
                {
                    string term = filter.Keyword.Trim().ToLower();
                    query = query.Where(n => n.TextMessage.ToLower().Contains(term));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var notificationsDto = _mapper.Map<IEnumerable<NotificationDto>>(entities);

                return new PagedResponseDto<NotificationDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Listado de notificaciones obtenido correctamente.",
                    Data = notificationsDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el listado de notificaciones.");
                return new PagedResponseDto<NotificationDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar las notificaciones."
                };
            }
        }
        public async Task<ResponseDto<IEnumerable<NotificationDto>>> GetUnreadByUserIdAsync(long userId)
        {
            var entities = await _context.Notifications
                .Include(n => n.Users)
                .Include(n => n.AlertTypes)
                .Where(n => n.IdUser == userId && !n.IsRead)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<NotificationDto>>(entities);
            return new ResponseDto<IEnumerable<NotificationDto>> { Status = true, StatusCode = 200, Data = dtos };
        }

        public async Task<ResponseDto<NotificationDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Notifications
                .Include(n => n.Users)
                .Include(n => n.AlertTypes)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (entity == null)
            {
                return new ResponseDto<NotificationDto> { Status = false, StatusCode = 404, Message = "Notificación no encontrada." };
            }

            return new ResponseDto<NotificationDto> { Status = true, StatusCode = 200, Data = _mapper.Map<NotificationDto>(entity) };
        }

        // Crear notificación (Se llamará de forma interna desde TicketService)
        public async Task<ResponseDto<NotificationDto>> CreateAsync(CreateNotificationDto dto)
        {
            // Verificamos si ya existe una transacción activa en la conexión actual
            var hasActiveTransaction = _context.Database.CurrentTransaction != null;

            // Solo abrimos una transacción nueva si nadie más ha abierto una afuera
            using var transaction = hasActiveTransaction
                ? null
                : await _context.Database.BeginTransactionAsync();

            try
            {
                var currentUserId = _authService.GetUserId();
                var currentDate = DateTime.Now;

                // Mapear y guardar la Notificación base
                var entity = _mapper.Map<NotificationEntity>(dto);

                entity.CreatedBy = currentUserId;
                entity.CreatedDate = currentDate;
                entity.IsRead = false;
                entity.SentAt = null;

                _context.Notifications.Add(entity);
                await _context.SaveChangesAsync(); 

                // DISPARO AUTOMÁTICO DEL LOG
                var logEntry = new NotificationHistoryEntity
                {
                    IdNotification = entity.Id,
                    ActionDate = currentDate,
                    CreatedBy = currentUserId,
                    CreatedDate = currentDate,
                };

                _context.NotificationHistories.Add(logEntry);
                await _context.SaveChangesAsync();

                //  3. Solo hacemos Commit si este método fue el dueño de la transacción
                if (transaction != null)
                {
                    await transaction.CommitAsync();
                }

                return await GetByIdAsync(entity.Id);
            }
            catch (Exception)
            {
                //  4. Si algo falla y nosotros abrimos la transacción, hacemos Rollback aquí.
                // Si la transacción venía de afuera (TicketService), dejamos que el catch de afuera la revierta.
                if (transaction != null)
                {
                    await transaction.RollbackAsync();
                }
                throw;
            }
        }
        public async Task<ResponseDto<bool>> MarkAsReadAsync(long id)
        {
            var entity = await _context.Notifications.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            entity.IsRead = true;
            entity.UpdatedBy = _authService.GetUserId();
            entity.UpdatedDate = DateTime.Now;

            _context.Notifications.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }

   
        public async Task<ResponseDto<bool>> UpdateSentStatusAsync(long id)
        {
            var entity = await _context.Notifications.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            entity.SentAt = DateTime.Now; 

            _context.Notifications.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}