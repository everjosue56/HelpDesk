using HelpDesk.Dtos.ImpactDto;
using HelpDesk.Dtos.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.ImpactServices
{
    public interface IImpactService
    {
        Task<ResponseDto<IEnumerable<ImpactDto>>> GetAllAsync();
        Task<ResponseDto<ImpactDto>> GetByIdAsync(long id);
        Task<ResponseDto<ImpactDto>> CreateAsync(CreateImpactDto dto);
        Task<ResponseDto<ImpactDto>> UpdateAsync(UpdateImpactDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
