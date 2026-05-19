using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.OrganizationsDto;
using HelpDesk.Dtos.RolesDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.RolServices
{
    public interface IRolService
    {
        Task<ResponseDto<IEnumerable<RolDto>>> GetAllAsync();
        Task<ResponseDto<RolDto>> GetByIdAsync(long id);
        Task<ResponseDto<RolDto>> CreateAsync(CreateRolDto dto);
        Task<ResponseDto<RolDto>> UpdateAsync(UpdateRolDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
