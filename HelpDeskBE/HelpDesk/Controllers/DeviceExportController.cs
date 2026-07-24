using HelpDesk.Services.DeviceExportService;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [Route("api/device-export")]
    [ApiController]
    public class DeviceExportController : ControllerBase
    {
        private readonly IDeviceExportService _exportService;

        public DeviceExportController(IDeviceExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var fileBytes = await _exportService.ExportDevicesToExcelAsync();
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Inventario_Dispositivos_{DateTime.Now:yyyyMMdd}.xlsx");
        }
    }
}
