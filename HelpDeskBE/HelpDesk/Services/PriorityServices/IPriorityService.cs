using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.PriorityDto;
using System.Threading.Tasks;
using System.Collections.Generic;


namespace HelpDesk.Services.PriorityServices
{
    public interface IPriorityService
    {
        Task<ResponseDto<IEnumerable<PriorityDto>>> GetAllAsync();
        Task<ResponseDto<PriorityDto>> GetByIdAsync(long id);
        Task<ResponseDto<PriorityDto>> CreateAsync(CreatePriorityDto dto);
        Task<ResponseDto<PriorityDto>> UpdateAsync(UpdatePriorityDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
