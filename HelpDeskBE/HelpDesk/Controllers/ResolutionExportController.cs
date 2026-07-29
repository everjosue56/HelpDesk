using HelpDesk.Services.ResolutionExportService;
using HelpDesk.Services.TicketExportService;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    public class ResolutionExportController : ControllerBase
    {
        private readonly IExportResolutionService _exportService;

        public ResolutionExportController(IExportResolutionService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("export/resolution-excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var fileBytes = await _exportService.ExportResolutionToExcelAsync();
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Soporte_Resoluciones_{DateTime.Now:yyyyMMdd}.xlsx");
        }
    }
}
