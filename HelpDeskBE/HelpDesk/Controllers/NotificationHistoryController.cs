using HelpDesk.Dtos.Common;
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
        public async Task<ActionResult<ResponseDto<IEnumerable<NotificationHistoryDto>>>> GetLog()
        {
            var response = await _historyService.GetLogAsync();
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