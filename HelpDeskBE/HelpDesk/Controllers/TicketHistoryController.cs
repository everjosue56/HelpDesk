using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TicketHistory;
using HelpDesk.Services.TicketHistoryService;
using HelpDesk.Services.TicketHistoryServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/ticket-histories")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI,Cliente")] 
    public class TicketHistoryController : ControllerBase
    {
        private readonly ITicketHistoryService _historyService;

        public TicketHistoryController(ITicketHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador,TI,Cliente")]  
        public async Task<IActionResult> GetAll([FromQuery] TicketHistoryFilterDto filter)
        { 
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int currentUserId = int.TryParse(userIdClaim, out var id) ? id : 0;

          
            bool isCliente = User.IsInRole("Cliente");

            var response = await _historyService.GetAllAsync(filter, currentUserId, isCliente);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<TicketHistoryDto>>> GetById(long id)
        {
            var response = await _historyService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")] 
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _historyService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}