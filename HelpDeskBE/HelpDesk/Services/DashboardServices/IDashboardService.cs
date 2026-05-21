using HelpDesk.Dtos.DashboardDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.DashboardServices
{
    public interface IDashboardService
    {
        Task<List<DashboardDto>> GetSlaReportAsync(int year);
        Task<List<AgencyLoadDto>> GetTicketsByAgencyAsync(int year);
        Task<List<AreaPerformanceDto>> GetTicketsByAreaAsync(int year);
        Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync(int year);
    }
}
