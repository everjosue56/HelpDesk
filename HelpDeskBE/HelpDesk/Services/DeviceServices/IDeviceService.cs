using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.DeviceDto;
using HelpDesk.Dtos.FiltersDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.DeviceServices
{
    public interface IDeviceService
    {
        // Cambias el GetAllAsync plano por este:
        Task<PagedResponseDto<DeviceDto>> GetAllAsync(DevicesFilterDto filter);
        Task<ResponseDto<DeviceDto>> GetByIdAsync(long id);
        Task<ResponseDto<DeviceDto>> CreateAsync(CreateDeviceDto dto);
        Task<ResponseDto<DeviceDto>> UpdateAsync(UpdateDeviceDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
