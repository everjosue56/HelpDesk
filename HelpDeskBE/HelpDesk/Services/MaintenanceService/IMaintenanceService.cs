using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceDto;
using HelpDesk.Dtos.OrganizationsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.MaintenanceService
{
    public interface IMaintenanceService
    {
        Task<PagedResponseDto<MaintenanceDto>> GetAllAsync(MaintenanceFilterDto filter);
        Task<ResponseDto<MaintenanceDto>> GetByIdAsync(long id);
        Task<ResponseDto<MaintenanceDto>> CreateAsync(CreateMaintenanceDto dto);
        Task<ResponseDto<MaintenanceDto>> UpdateAsync(UpdateMaintenanceDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
        Task<ResponseDto<List<MaintenanceCalendarDto>>> GetMaintenanceCalendarAsync(int? year, int? month);
        Task<ResponseDto<MaintenanceDto>> RenewAsync(long previousMaintenanceId, RenewMaintenanceDto dto);
    }
}
