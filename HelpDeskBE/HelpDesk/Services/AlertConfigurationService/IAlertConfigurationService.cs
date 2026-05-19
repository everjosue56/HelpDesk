using HelpDesk.Dtos.AlertConfigurationDto;
using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.AlertConfigurationService
{
    public interface IAlertConfigurationService
    {
        Task<ResponseDto<IEnumerable<AlertConfigurationDto>>> GetAllAsync();
        Task<ResponseDto<AlertConfigurationDto>> GetByIdAsync(long id);
        Task<ResponseDto<AlertConfigurationDto>> CreateAsync(CreateAlertConfigurationDto dto);
        Task<ResponseDto<AlertConfigurationDto>> UpdateAsync(UpdateAlertConfigurationDto dto, long id);
        Task<ResponseDto<bool>> ExecuteAlertAsync(long alertConfigurationId);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
