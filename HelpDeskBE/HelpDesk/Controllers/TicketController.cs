using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Services.TicketService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador,TI,Cliente")]
        public async Task<IActionResult> GetAll([FromQuery] TicketFilterDto filter)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            long currentUserId = long.TryParse(userIdClaim, out var id) ? id : 0;

            bool isCliente = User.IsInRole("Cliente");

            var response = await _ticketService.GetAllAsync(filter, isCliente, currentUserId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<TicketDto>>> GetById(long id)
        {
            var response = await _ticketService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}/claim")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<bool>>> Claim(long id)
        {
            var response = await _ticketService.ClaimTicketAsync (id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<TicketDto>>> Create([FromBody] CreateTicketDto dto)
        {
            var response = await _ticketService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<TicketDto>>> Update([FromBody] UpdateTicketDto dto, long id)
        {
            var response = await _ticketService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador,TI,Cliente")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _ticketService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}