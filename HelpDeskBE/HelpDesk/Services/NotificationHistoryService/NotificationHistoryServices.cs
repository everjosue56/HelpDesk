using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.NotificationHistoryDto;
using HelpDesk.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.NotificationHistoryService
{
    public class NotificationHistoryService : INotificationHistoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;

        public NotificationHistoryService(ApplicationDbContext context, IMapper mapper, ILogger<NotificationHistoryService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PagedResponseDto<NotificationHistoryDto>> GetLogAsync(NotificationHistoryFilterDto filter)
        {
            try
            {
                var query = _context.NotificationHistories
                    .OrderByDescending(nh => nh.ActionDate)
                    .Include(nh => nh.Notifications)
                        .ThenInclude(n => n.Users)
                    .AsQueryable();

                if (filter.IdNotification.HasValue)
                {
                    query = query.Where(nh => nh.IdNotification == filter.IdNotification.Value);
                }

                if (filter.DateFrom.HasValue)
                {
                    query = query.Where(nh => nh.ActionDate >= filter.DateFrom.Value);
                }

                if (filter.DateTo.HasValue)
                {
                    var endOfDay = filter.DateTo.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(nh => nh.ActionDate <= endOfDay);
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var dtos = _mapper.Map<IEnumerable<NotificationHistoryDto>>(entities);

                return new PagedResponseDto<NotificationHistoryDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Log de notificaciones obtenido correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el log de notificaciones.");
                return new PagedResponseDto<NotificationHistoryDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar el log."
                };
            }
        }

        public async Task<ResponseDto<NotificationHistoryDto>> GetLogByIdAsync(long id)
        {
            var entity = await _context.NotificationHistories
                .Include(nh => nh.Notifications)
                    .ThenInclude(n => n.Users)
                .FirstOrDefaultAsync(nh => nh.Id == id);

            if (entity == null)
            {
                return new ResponseDto<NotificationHistoryDto> { Status = false, StatusCode = 404, Message = "Registro de log no encontrado." };
            }

            return new ResponseDto<NotificationHistoryDto> { Status = true, StatusCode = 200, Data = _mapper.Map<NotificationHistoryDto>(entity) };
        }
    }
}