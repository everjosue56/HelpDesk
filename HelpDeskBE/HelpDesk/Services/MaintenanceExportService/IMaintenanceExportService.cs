using System.Threading.Tasks;

namespace HelpDesk.Services.Interfaces
{
    public interface IMaintenanceExportService
    {
        Task<byte[]> ExportMaintenancesToExcelAsync(int year, int? month);
    }
}