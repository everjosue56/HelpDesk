using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceHistoryDto;
using HelpDesk.Dtos.NotificationDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.NotificationServices
{
    public interface INotificationService
    {
        Task<PagedResponseDto<NotificationDto>> GetAllAsync(NotificationFilterDto filter);
        Task<ResponseDto<IEnumerable<NotificationDto>>> GetUnreadByUserIdAsync(long userId);
        Task<ResponseDto<NotificationDto>> GetByIdAsync(long id);
        Task<ResponseDto<NotificationDto>> CreateAsync(CreateNotificationDto dto);
        Task<ResponseDto<bool>> MarkAsReadAsync(long id);
        Task<ResponseDto<bool>> UpdateSentStatusAsync(long id);
    }
}
