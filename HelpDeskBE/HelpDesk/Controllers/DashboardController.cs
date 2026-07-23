using HelpDesk.Services.DashboardServices;
using HelpDesk.Services.MaintenanceService;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.DashboardDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IMaintenanceService _maintenanceService;
       

        public DashboardController(IDashboardService dashboardService, IMaintenanceService maintenanceService)
        {
            _dashboardService = dashboardService;
            _maintenanceService = maintenanceService;

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
        public async Task<IActionResult> GetCargaAreas([FromQuery] int year, [FromQuery] int? month, [FromQuery] long? agency)
        {
            var data = await _dashboardService.GetTicketsByAreaAsync(year, month, agency);
            return Ok(data);
        }

        [HttpGet("rendimiento-tecnicos")]
        public async Task<IActionResult> GetRendimientoTecnicos([FromQuery] int year, [FromQuery] int? month, [FromQuery] long? userId)
        {
            var data = await _dashboardService.GetTechnicianPerformanceAsync(year, month, userId);
            return Ok(data);
        }
        [HttpGet("dashboard-stats")]
        [Authorize] 
        [ProducesResponseType(typeof(ResponseDto<MaintenanceDashboardDataDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDashboardStats([FromQuery] int year, [FromQuery] int month = 0)
        {

            int? filterMonth = month > 0 ? month : null;

            var response = await _maintenanceService.GetDashboardStatsAsync(year, filterMonth);

            if (response.Status)
            {
                return Ok(response);
            }
             
            return BadRequest(response);
        }
    }
}