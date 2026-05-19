using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.NotificationHistoryDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.NotificationHistoryService
{
    public interface INotificationHistoryService
    {
        Task<ResponseDto<IEnumerable<NotificationHistoryDto>>> GetLogAsync();
        Task<ResponseDto<NotificationHistoryDto>> GetLogByIdAsync(long id);
    }
}
