using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Dtos.TypeMaintenanceDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeMaintenanceServices
{
    public interface ITypeMaintenanceService
    {
        Task<PagedResponseDto<TypeMaintenanceDto>> GetAllAsync(TypeMaintenanceFilterDto filter);
        Task<ResponseDto<TypeMaintenanceDto>> GetByIdAsync(long id);
        Task<ResponseDto<TypeMaintenanceDto>> CreateAsync(CreateTypeMaintenanceDto dto);
        Task<ResponseDto<TypeMaintenanceDto>> UpdateAsync(UpdateTypeMaintenanceDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
