using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TicketDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TicketService
{
    public interface ITicketService
    {
        Task<PagedResponseDto<TicketDto>> GetAllAsync(TicketFilterDto filter, bool isCliente, int currentUserId);
        Task<ResponseDto<TicketDto>> GetByIdAsync(long id);
        Task<ResponseDto<TicketDto>> CreateAsync(CreateTicketDto dto);
        Task<ResponseDto<TicketDto>> UpdateAsync(UpdateTicketDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
