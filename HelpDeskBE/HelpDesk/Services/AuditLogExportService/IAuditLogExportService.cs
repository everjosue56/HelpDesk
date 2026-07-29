using System.Threading.Tasks;

namespace HelpDesk.Services.AuditLogExportService
{
    public interface IAuditLogExportService
    {
        Task<byte[]> ExportAuditLogsToExcelAsync(int year, int? month);
    }
}
