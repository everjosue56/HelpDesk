using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.ImpactDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.ImpactServices
{
    public interface IImpactService
    {
        Task<PagedResponseDto<ImpactDto>> GetAllAsync(ImpactFilterDto filter);
        Task<ResponseDto<ImpactDto>> GetByIdAsync(long id);
        Task<ResponseDto<ImpactDto>> CreateAsync(CreateImpactDto dto);
        Task<ResponseDto<ImpactDto>> UpdateAsync(UpdateImpactDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
