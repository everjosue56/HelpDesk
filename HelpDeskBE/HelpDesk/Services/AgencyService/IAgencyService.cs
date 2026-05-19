using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.OrganizationsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.AgencyService
{
    public interface IAgencyService
    {
        Task<ResponseDto<IEnumerable<AgencyDto>>> GetAllAsync();
        Task<ResponseDto<AgencyDto>> GetByIdAsync(long id);
        Task<ResponseDto<AgencyDto>> CreateAsync(CreateAgencyDto dto);
        Task<ResponseDto<AgencyDto>> UpdateAsync(UpdateAgencyDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
