using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.NotificationDto;
using HelpDesk.Services.NotificationService;
using HelpDesk.Services.NotificationServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    [Authorize] // Cualquier usuario autenticado puede interactuar con sus notificaciones
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador,TI")] // Solo auditoría o TI ven el historial global
        public async Task<IActionResult> GetAll([FromQuery] NotificationFilterDto filter)
        {
            var response = await _notificationService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("unread/user/{userId}")]
        public async Task<ActionResult<ResponseDto<IEnumerable<NotificationDto>>>> GetUnreadByUserId(long userId)
        {
            var response = await _notificationService.GetUnreadByUserIdAsync(userId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<NotificationDto>>> GetById(long id)
        {
            var response = await _notificationService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}/mark-as-read")]
        public async Task<ActionResult<ResponseDto<bool>>> MarkAsRead(long id)
        {
            var response = await _notificationService.MarkAsReadAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}