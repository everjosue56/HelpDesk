using HelpDesk.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{

    [Route("api/maintenances-export")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class MaintenanceExportController : ControllerBase
    {
        private readonly IMaintenanceExportService _maintenanceExportService;

        public MaintenanceExportController(IMaintenanceExportService maintenanceExportService)
        {
            _maintenanceExportService = maintenanceExportService;
        }

        [HttpGet("export/excel")]
        [Authorize]
        public async Task<IActionResult> ExportToExcel([FromQuery] int year, [FromQuery] int? month = null)
        {
            var fileBytes = await _maintenanceExportService.ExportMaintenancesToExcelAsync(year, month);
            string fileName = $"Reporte_Mantenimientos_{year}_{(month.HasValue ? month.Value.ToString("D2") : "Anual")}.xlsx";

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName
            );
        }
    }
}
