using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TypeDevicesDto;
using HelpDesk.Dtos.TypeMaintenanceDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeDeviceServices
{
    public interface ITypeDevicesService
    {
        Task<ResponseDto<IEnumerable<TypeDevicesDto>>> GetAllAsync();
        Task<ResponseDto<TypeDevicesDto>> GetByIdAsync(long id);
        Task<ResponseDto<TypeDevicesDto>> CreateAsync(CreateTypeDevicesDto dto);
        Task<ResponseDto<TypeDevicesDto>> UpdateAsync(UpdateTypeDevicesDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
