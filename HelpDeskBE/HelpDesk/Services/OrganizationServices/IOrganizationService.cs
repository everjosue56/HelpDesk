using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.OrganizationsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.Organizations
{
    public interface IOrganizationService
    {
        Task<PagedResponseDto<OrganizationDto>> GetAllAsync(OrganizationFilterDto filter);
        Task<ResponseDto<OrganizationDto>> GetByIdAsync (long id);
        Task<ResponseDto<OrganizationDto>> CreateAsync(CreateOrganizationDto dto);
        Task<ResponseDto<OrganizationDto>> UpdateAsync(UpdateOrganizationDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
