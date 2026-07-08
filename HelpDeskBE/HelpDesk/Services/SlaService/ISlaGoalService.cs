using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.SLA;
using System.Threading.Tasks;

namespace HelpDesk.Services.SlaService
{
    public interface ISlaGoalService
    {
        Task<ResponseDto<bool>> SaveAsync(SaveSlaGoalDto dto);
    }
}
