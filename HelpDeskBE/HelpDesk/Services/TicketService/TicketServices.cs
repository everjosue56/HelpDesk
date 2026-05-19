using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.NotificationDto; 
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.NotificationService;
using HelpDesk.Services.NotificationServices;
using HelpDesk.Services.TicketService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class TicketServices : ITicketService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public readonly IAuthService _authService;
        private readonly INotificationService _notificationService;

        public TicketServices(
            ApplicationDbContext context,
            IMapper mapper,
            IAuthService authService,
            INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _notificationService = notificationService;
        }

        public async Task<ResponseDto<IEnumerable<TicketDto>>> GetAllAsync()
        {
            var entities = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.TypeError)
                .Include(t => t.Area)
                .Include(t => t.SoftwareSystem)
                .Include(t => t.Impact)
                .Include(t => t.Priority)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<TicketDto>>(entities);

            return new ResponseDto<IEnumerable<TicketDto>>
            {
                Status = true,
                Data = dtos,
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<TicketDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Tickets
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

                _context.Tickets.Add(entity);
                await _context.SaveChangesAsync();

                // ----------------------------------------------
                // 1. DISPARAR EL SERVICIO DE NOTIFICACIONES
                // ----------------------------------------------
                var createNotificationDto = new CreateNotificationDto
                {
                    IdUser = entity.IdUser,     
                    IdAlertType = 2,             
                    TextMessage = $"Tu Ticket #{entity.Id} ha sido creado exitosamente. Pronto un técnico tomará tu caso.",
                    IdReference = entity.Id      
                };
                // en 'notification' y 'notification_history' de un solo golpe.
                await _notificationService.CreateAsync(createNotificationDto);

                // --------------------------------
                // 2. CONFIRMAR TODO EN SQL SERVER
                // --------------------------------
                await transaction.CommitAsync();

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
            var entity = await _context.Tickets.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool>
                {
                    Status = false,
                    Data = false,
                    StatusCode = 404,
                    Message = "El ticket ya no existe."
                };
            }

            _context.Tickets.Remove(entity);
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