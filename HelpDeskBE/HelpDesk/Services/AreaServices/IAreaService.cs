using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.OrganizationsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.AreaServices
{
    public interface IAreaService
    {
        Task<PagedResponseDto<AreaDto>> GetAllAsync(AreaFilterDto pagination);
        Task<ResponseDto<AreaDto>> GetByIdAsync(long id);
        Task<ResponseDto<AreaDto>> CreateAsync(CreateAreaDto dto);
        Task<ResponseDto<AreaDto>> UpdateAsync(UpdateAreaDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
