using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.PriorityDto;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace HelpDesk.Services.PriorityServices
{
    public interface IPriorityService
    {
        Task<PagedResponseDto<PriorityDto>> GetAllAsync(PriorityFilterDto filter);
        Task<ResponseDto<PriorityDto>> GetByIdAsync(long id);
        Task<ResponseDto<PriorityDto>> CreateAsync(CreatePriorityDto dto);
        Task<ResponseDto<PriorityDto>> UpdateAsync(UpdatePriorityDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
