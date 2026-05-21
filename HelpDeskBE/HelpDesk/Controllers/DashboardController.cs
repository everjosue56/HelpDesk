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

        // 1. Reporte de Disponibilidad Mensual 
        [HttpGet("sla-mensual/{year}")]
        public async Task<IActionResult> GetSlaMensual(int year)
        {
            var data = await _dashboardService.GetSlaReportAsync(year);
            return Ok(data);
        }

        // 2. Carga operativa por Agencias/Sucursales
        [HttpGet("carga-agencias/{year}")]
        public async Task<IActionResult> GetCargaAgencias(int year)
        {
            var data = await _dashboardService.GetTicketsByAgencyAsync(year);
            return Ok(data);
        }

        // 3. Carga operativa por Áreas/Departamentos del Hospital
        [HttpGet("carga-areas/{year}")]
        public async Task<IActionResult> GetCargaAreas(int year)
        {
            var data = await _dashboardService.GetTicketsByAreaAsync(year);
            return Ok(data);
        }

        // 4. Rendimiento y productividad del equipo técnico
        [HttpGet("rendimiento-tecnicos/{year}")]
        public async Task<IActionResult> GetRendimientoTecnicos(int year)
        {
            var data = await _dashboardService.GetTechnicianPerformanceAsync(year);
            return Ok(data);
        }
    }
}