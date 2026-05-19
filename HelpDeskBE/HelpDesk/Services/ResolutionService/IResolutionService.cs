using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.ResolutionDto;
using HelpDesk.Dtos.RolesDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.ResolutionService
{
    public interface IResolutionService
    {
        Task<ResponseDto<IEnumerable<ResolutionDto>>> GetAllAsync();
        Task<ResponseDto<ResolutionDto>> GetByIdAsync(long id);
        Task<ResponseDto<ResolutionDto>> CreateAsync(CreateResolutionDto dto);
        Task<ResponseDto<ResolutionDto>> UpdateAsync(UpdateResolutionDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
