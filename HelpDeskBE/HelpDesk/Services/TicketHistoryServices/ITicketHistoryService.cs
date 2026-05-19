using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Dtos.TicketHistory;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TicketHistoryServices
{
    public interface ITicketHistoryService
    {
        Task<ResponseDto<IEnumerable<TicketHistoryDto>>> GetAllAsync();
        Task<ResponseDto<TicketHistoryDto>> GetByIdAsync(long id);
        Task<ResponseDto<TicketHistoryDto>> CreateAsync(long ticketId, long resolutionId, long userId);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
