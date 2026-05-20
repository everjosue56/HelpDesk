using HelpDesk.Dtos.AlertHistoryDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.AlertHistoryServices
{
    public interface IAlertHistoryService
    {
        Task<PagedResponseDto<AlertHistoryDto>> GetAllAsync(AlertHistoryFilterDto filter);
        Task<ResponseDto<AlertHistoryDto>> GetByIdAsync(long id);   
        Task<ResponseDto<AlertHistoryDto>> CreateAsync(long alertConfigurationId, long executedByUserId);
    }
}
