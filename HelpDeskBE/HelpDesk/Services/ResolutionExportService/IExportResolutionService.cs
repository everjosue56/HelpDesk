using System.Threading.Tasks;

namespace HelpDesk.Services.ResolutionExportService
{
    public interface IExportResolutionService
    {
        Task<byte[]> ExportResolutionToExcelAsync();
    }
}
