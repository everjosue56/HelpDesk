using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Services.TicketService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    [Authorize] // Requiere que el usuario esté logueado para reportar fallas
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<TicketDto>>>> GetAll()
        {
            var response = await _ticketService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<TicketDto>>> GetById(long id)
        {   
            var response = await _ticketService.GetByIdAsync(id);
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
        [Authorize(Roles = "Administrador,TI")] // Solo personal autorizado puede borrar registros
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _ticketService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}