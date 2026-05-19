using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Dtos.TypeMaintenanceDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeMaintenanceServices
{
    public interface ITypeMaintenanceService
    {
        Task<ResponseDto<IEnumerable<TypeMaintenanceDto>>> GetAllAsync();
        Task<ResponseDto<TypeMaintenanceDto>> GetByIdAsync(long id);
        Task<ResponseDto<TypeMaintenanceDto>> CreateAsync(CreateTypeMaintenanceDto dto);
        Task<ResponseDto<TypeMaintenanceDto>> UpdateAsync(UpdateTypeMaintenanceDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
