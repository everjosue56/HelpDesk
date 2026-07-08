using HelpDesk.Services.DashboardServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("sla-mensual/{year}")]
        public async Task<IActionResult> GetSlaMensual(int year)
        {
            var data = await _dashboardService.GetSlaReportAsync(year);
            return Ok(data);
        }

        [HttpGet("carga-agencias")]
        public async Task<IActionResult> GetCargaAgencias([FromQuery] int year, [FromQuery] int? month)
        {
            var data = await _dashboardService.GetTicketsByAgencyAsync(year, month);
            return Ok(data);
        }

        [HttpGet("carga-areas")]
        public async Task<IActionResult> GetCargaAreas([FromQuery] int year, [FromQuery] int? month, [FromQuery] int? agency)
        {
            var data = await _dashboardService.GetTicketsByAreaAsync(year, month, agency);
            return Ok(data);
        }

        [HttpGet("rendimiento-tecnicos")]
        public async Task<IActionResult> GetRendimientoTecnicos([FromQuery] int year, [FromQuery] int? month, [FromQuery] int? userId)
        {
            var data = await _dashboardService.GetTechnicianPerformanceAsync(year, month, userId);
            return Ok(data);
        }
    }
}