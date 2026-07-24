using HelpDesk.Services.DeviceExportService;
using HelpDesk.Services.TicketExportService;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    public class TicketExportController : ControllerBase
    {
        private readonly ITicketExportService _exportService;

        public TicketExportController(ITicketExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("export/ticket-excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var fileBytes = await _exportService.ExportTicketToExcelAsync();
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Inventario_Tickets_{DateTime.Now:yyyyMMdd}.xlsx");
        }
    }
}
