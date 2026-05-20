using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceHistoryDto;
using HelpDesk.Services.MaintenanceHistoryService;
using HelpDesk.Services.MaintenancesHistoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/maintenance-histories")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class MaintenanceHistoryController : ControllerBase
    {
        private readonly IMaintenancesHistoryService _historyService;

        public MaintenanceHistoryController(IMaintenancesHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] MaintenanceHistoryFilterDto filter)
        {
            var response = await _historyService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }
            
        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<MaintenanceHistoryDto>>> GetById(long id)
        {
            var response = await _historyService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}