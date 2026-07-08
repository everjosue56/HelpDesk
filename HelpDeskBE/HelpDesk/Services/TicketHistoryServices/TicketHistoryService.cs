using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TicketHistory;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TicketHistoryServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.TicketHistoryService
{
    public class TicketHistoryService : ITicketHistoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public TicketHistoryService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<TicketHistoryService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<TicketHistoryDto>> GetAllAsync(TicketHistoryFilterDto filter, int currentUserId, bool isCliente)
        {
            try
            {
                var query = _context.TicketHistories
                    .Include(th => th.Resolution)
                    .Include(th => th.User)
                    .Include(th => th.Ticket)
                        .ThenInclude(t => t.SoftwareSystem)
                    .OrderByDescending(th => th.CreatedDate)
                    .AsQueryable();

                if (isCliente)
                {
                    query = query.Where(th => th.Ticket.IdUser == currentUserId);
                }
                else
                {
                   
                    if (filter.IdUser.HasValue)
                    {
                        query = query.Where(th => th.IdUser == filter.IdUser.Value);
                    }
                }

                if (filter.IdTicket.HasValue)
                {
                    query = query.Where(th => th.IdTicket == filter.IdTicket.Value);
                }

                if (filter.IdResolution.HasValue)
                {
                    query = query.Where(th => th.IdResolution == filter.IdResolution.Value);
                }

                if (filter.DateFrom.HasValue)
                {
                    query = query.Where(th => th.CloseDate >= filter.DateFrom.Value);
                }

                if (filter.DateTo.HasValue)
                {
                    var endOfDay = filter.DateTo.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(th => th.CloseDate <= endOfDay);
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var dtos = _mapper.Map<IEnumerable<TicketHistoryDto>>(entities);

                return new PagedResponseDto<TicketHistoryDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Historial de tickets recuperado correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el historial de tickets.");
                return new PagedResponseDto<TicketHistoryDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar el historial."
                };
            }
        }

        public async Task<ResponseDto<TicketHistoryDto>> GetByIdAsync(long id)
        {
            var entity = await _context.TicketHistories
                .Include(th => th.Ticket)
                     .ThenInclude(t => t.SoftwareSystem)
                .Include(th => th.Resolution)
                .Include(th => th.User)
                .FirstOrDefaultAsync(th => th.Id == id);

            if (entity == null)
            {
                return new ResponseDto<TicketHistoryDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Registro histórico no encontrado."
                };
            }

            return new ResponseDto<TicketHistoryDto>
            {   
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<TicketHistoryDto>(entity)
            };
        }

        // Método para ser llamado automáticamente desde ResolutionService
        public async Task<ResponseDto<TicketHistoryDto>> CreateAsync(long ticketId, long resolutionId, long userId)
        {
            var history = new TicketHistoryEntity
            {
                IdTicket = ticketId,
                IdResolution = resolutionId,
                IdUser = userId,
                CloseDate = DateTime.Now,
                CreatedDate = DateTime.Now,
                CreatedBy = userId
            };

            _context.TicketHistories.Add(history);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(history.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.TicketHistories.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se encontró el registro para eliminar."
                };
            }

            // Aquí aplicamos el Soft Delete 
            _context.TicketHistories.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool>
            {
                Status = true,
                StatusCode = 200,
                Data = true
            };
        }
    }
}