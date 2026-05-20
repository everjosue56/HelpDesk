using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceHistoryDto;
using HelpDesk.Dtos.OrganizationsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.MaintenancesHistoryService
{
    public interface IMaintenancesHistoryService
    {
        Task<PagedResponseDto<MaintenanceHistoryDto>> GetAllAsync(MaintenanceHistoryFilterDto filter);
        Task<ResponseDto<MaintenanceHistoryDto>> GetByIdAsync(long id);
        Task<ResponseDto<MaintenanceHistoryDto>> CreateAsync(CreateMaintenanceHistoryDto dto);
        Task<ResponseDto<MaintenanceHistoryDto>> UpdateAsync(UpdateMaintenanceHistoryDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
