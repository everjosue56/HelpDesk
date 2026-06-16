using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Models;
using System.Threading.Tasks;

namespace HelpDesk.Services.AuditService
{
    public interface IAuditService
    {
        Task<PagedResponseDto<AuditLog>> GetAllAsync(AuditFilterDto pagination);
    }
}
