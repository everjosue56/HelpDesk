using System.Threading.Tasks;

namespace HelpDesk.Services.UserExportService
{
    public interface IUserExportService
    {
        Task<byte[]> ExportUserToExcelAsync();
    }
}
