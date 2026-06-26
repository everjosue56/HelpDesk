using HelpDesk.Dtos.DashboardDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.DashboardServices
{
    public interface IDashboardService
    {
        Task<List<DashboardDto>> GetSlaReportAsync(int year);
        Task<List<AgencyLoadDto>> GetTicketsByAgencyAsync(int year, int? month);
        Task<List<AreaPerformanceDto>> GetTicketsByAreaAsync(int year, int? month);
        Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync(int year, int? month, int? userId);
    }
}
