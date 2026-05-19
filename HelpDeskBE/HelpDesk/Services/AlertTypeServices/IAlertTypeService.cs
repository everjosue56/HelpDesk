using HelpDesk.Dtos.AlertTypeDto;
using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.AlertTypeServices
{
    public interface IAlertTypeService
    {
        Task<ResponseDto<IEnumerable<AlertTypeDto>>> GetAllAsync();
        Task<ResponseDto<AlertTypeDto>> GetByIdAsync(long id);
        Task<ResponseDto<AlertTypeDto>> CreateAsync(CreateAlertTypeDto dto);
        Task<ResponseDto<AlertTypeDto   >> UpdateAsync(UpdateAlertTypeDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
