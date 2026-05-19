using HelpDesk.Dtos.AlertHistoryDto;
using HelpDesk.Dtos.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.AlertHistoryServices
{
    public interface IAlertHistoryService
    {
        Task<ResponseDto<IEnumerable<AlertHistoryDto>>> GetAllAsync();
        Task<ResponseDto<AlertHistoryDto>> GetByIdAsync(long id);   
        Task<ResponseDto<AlertHistoryDto>> CreateAsync(long alertConfigurationId, long executedByUserId);
    }
}
