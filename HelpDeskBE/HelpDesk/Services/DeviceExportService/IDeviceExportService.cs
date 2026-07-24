using System.Threading.Tasks;

namespace HelpDesk.Services.DeviceExportService
{
    public interface IDeviceExportService
    {
        Task<byte[]> ExportDevicesToExcelAsync();
    }
}
