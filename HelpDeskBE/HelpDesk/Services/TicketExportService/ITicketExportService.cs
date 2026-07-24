using System.Threading.Tasks;

namespace HelpDesk.Services.TicketExportService
{
    public interface ITicketExportService
    {
        Task<byte[]> ExportTicketToExcelAsync();
    }
}
