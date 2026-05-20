using HelpDesk.Dtos.AlertHistoryDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Services.AlertHistoryService;
using HelpDesk.Services.AlertHistoryServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/alert-histories")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]  
    public class AlertHistoryController : ControllerBase
    {
        private readonly IAlertHistoryService _historyService;

        public AlertHistoryController(IAlertHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AlertHistoryFilterDto filter)
        {
            var response = await _historyService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<AlertHistoryDto>>> GetById(long id)
        {
            var response = await _historyService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}