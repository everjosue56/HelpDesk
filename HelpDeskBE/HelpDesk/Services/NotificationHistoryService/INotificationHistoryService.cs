using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.NotificationHistoryDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.NotificationHistoryService
{
    public interface INotificationHistoryService
    {
        Task<PagedResponseDto<NotificationHistoryDto>> GetLogAsync(NotificationHistoryFilterDto filter);
        Task<ResponseDto<NotificationHistoryDto>> GetLogByIdAsync(long id);
    }
}
