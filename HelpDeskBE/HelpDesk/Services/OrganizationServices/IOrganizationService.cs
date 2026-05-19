using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.OrganizationsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.Organizations
{
    public interface IOrganizationService
    {
        Task<ResponseDto<IEnumerable<OrganizationDto>>> GetAllAsync ();
        Task<ResponseDto<OrganizationDto>> GetByIdAsync (long id);
        Task<ResponseDto<OrganizationDto>> CreateAsync(CreateOrganizationDto dto);
        Task<ResponseDto<OrganizationDto>> UpdateAsync(UpdateOrganizationDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
