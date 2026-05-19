using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.SolutionStateDto;
using HelpDesk.Dtos.TicketDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.SolutionStateServices
{
    public interface ISolutionStateService
    {
        Task<ResponseDto<IEnumerable<SolutionStateDto>>> GetAllAsync();
        Task<ResponseDto<SolutionStateDto>> GetByIdAsync(long id);
        Task<ResponseDto<SolutionStateDto>> CreateAsync(CreateSolutionStateDto dto);
        Task<ResponseDto<SolutionStateDto>> UpdateAsync(UpdateSolutionStateDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
