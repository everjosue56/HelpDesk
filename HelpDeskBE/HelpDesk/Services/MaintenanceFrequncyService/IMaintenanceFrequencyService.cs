using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceFrequencyDto;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Threading.Tasks;

namespace HelpDesk.Services.MaintenanceFrequncyService
{
    public interface IMaintenanceFrequencyService
    {
        Task<PagedResponseDto<MaintenanceFrequencyDto>> GetAllAsync(MaintenanceFrequencyFilterDto filter);
        Task<ResponseDto<MaintenanceFrequencyDto>> GetByIdAsync(long id);
        Task<ResponseDto<MaintenanceFrequencyDto>> CreateAsync(CreateMaintenanceFrequencyDto dto);
        Task<ResponseDto<MaintenanceFrequencyDto>> UpdateAsync(UpdateMaintenanceFrequecyDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
