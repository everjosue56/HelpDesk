using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.ResolutionDto;
using HelpDesk.Dtos.RolesDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.ResolutionService
{
    public interface IResolutionService
    {
        Task<PagedResponseDto<ResolutionDto>> GetAllAsync(ResolutionFilterDto filter);
        Task<ResponseDto<ResolutionDto>> GetByIdAsync(long id);
        Task<ResponseDto<ResolutionDto>> CreateAsync(CreateResolutionDto dto);
        Task<ResponseDto<ResolutionDto>> UpdateAsync(UpdateResolutionDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
