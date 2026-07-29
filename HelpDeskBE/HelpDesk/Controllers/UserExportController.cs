
using HelpDesk.Services.TicketExportService;
using HelpDesk.Services.UserExportService;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    public class UserExportController : ControllerBase
    {
        private readonly IUserExportService _exportService;

        public UserExportController(IUserExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("export/user-excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var fileBytes = await _exportService.ExportUserToExcelAsync();
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Listado_Usuarios_{DateTime.Now:yyyyMMdd}.xlsx");
        }
    }
}
