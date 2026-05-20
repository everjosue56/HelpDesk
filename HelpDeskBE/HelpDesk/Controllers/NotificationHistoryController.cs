using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.NotificationHistoryDto;
using HelpDesk.Services.NotificationHistoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/notification-histories")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]  
    public class NotificationHistoryController : ControllerBase
    {
        private readonly INotificationHistoryService _historyService;

        public NotificationHistoryController(INotificationHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLog([FromQuery] NotificationHistoryFilterDto filter)
        {
            var response = await _historyService.GetLogAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<NotificationHistoryDto>>> GetLogById(long id)
        {
            var response = await _historyService.GetLogByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}