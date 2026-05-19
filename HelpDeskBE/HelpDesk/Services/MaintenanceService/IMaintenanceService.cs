using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.MaintenanceDto;
using HelpDesk.Dtos.OrganizationsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.MaintenanceService
{
    public interface IMaintenanceService
    {
        Task<ResponseDto<IEnumerable<MaintenanceDto>>> GetAllAsync();
        Task<ResponseDto<MaintenanceDto>> GetByIdAsync(long id);
        Task<ResponseDto<MaintenanceDto>> CreateAsync(CreateMaintenanceDto dto);
        Task<ResponseDto<MaintenanceDto>> UpdateAsync(UpdateMaintenanceDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
