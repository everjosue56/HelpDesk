using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.NotificationHistoryDto;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.NotificationHistoryService
{
    public class NotificationHistoryService : INotificationHistoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public NotificationHistoryService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ResponseDto<IEnumerable<NotificationHistoryDto>>> GetLogAsync()
        {
            // Cargamos las relaciones en cadena para alimentar tu DTO plano
            var entities = await _context.NotificationHistories
                .OrderByDescending(nh => nh.ActionDate)
                .Include(nh => nh.Notifications)
                .ThenInclude(n => n.Users)   
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<NotificationHistoryDto>>(entities);
            return new ResponseDto<IEnumerable<NotificationHistoryDto>> { Status = true, StatusCode = 200, Data = dtos };
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