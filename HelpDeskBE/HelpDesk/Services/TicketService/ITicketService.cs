using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TicketDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TicketService
{
    public interface ITicketService
    {
        Task<ResponseDto<IEnumerable<TicketDto>>> GetAllAsync();
        Task<ResponseDto<TicketDto>> GetByIdAsync(long id);
        Task<ResponseDto<TicketDto>> CreateAsync(CreateTicketDto dto);
        Task<ResponseDto<TicketDto>> UpdateAsync(UpdateTicketDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
