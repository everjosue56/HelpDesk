using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Dtos.TicketHistory;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TicketHistoryServices
{
    public interface ITicketHistoryService
    {
        Task<PagedResponseDto<TicketHistoryDto>> GetAllAsync(TicketHistoryFilterDto filter, int currentUserId, bool isCliente);
        Task<ResponseDto<TicketHistoryDto>> GetByIdAsync(long id);
        Task<ResponseDto<TicketHistoryDto>> CreateAsync(long ticketId, long resolutionId, long userId);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
