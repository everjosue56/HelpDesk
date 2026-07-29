using HelpDesk.Services.AuditLogExportService;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogExportController : ControllerBase
    {
        private readonly IAuditLogExportService _exportService;

        public AuditLogExportController(IAuditLogExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportToExcel([FromQuery] int year, [FromQuery] int? month = null)
        {
            if (year <= 0)
            {
                year = DateTime.UtcNow.Year;
            }

            var fileBytes = await _exportService.ExportAuditLogsToExcelAsync(year, month);
            string fileName = $"AuditLogs_{year}_{(month.HasValue ? month.Value.ToString("00") : "Anual")}.xlsx";

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName
            );
        }
    }
}