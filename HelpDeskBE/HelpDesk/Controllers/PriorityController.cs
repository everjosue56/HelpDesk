using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.ImpactDto;
using HelpDesk.Dtos.PriorityDto;
using HelpDesk.Services.ImpactServices;
using HelpDesk.Services.PriorityServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/priority")]
    [ApiController]
    [Authorize] // Requiere estar autenticado
    public class PriorityController : ControllerBase
    {
        private readonly IPriorityService _priorityService;

        public PriorityController(IPriorityService prioritytService)
        {
            _priorityService = prioritytService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<PriorityDto>>>> GetAll()
        {
            var response = await _priorityService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<PriorityDto>>> GetById(long id)
        {
            var response = await _priorityService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,TI")] // Solo niveles altos pueden crear
        public async Task<ActionResult<ResponseDto<PriorityDto>>> Create([FromBody] CreatePriorityDto dto)
        {
            var response = await _priorityService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<PriorityDto>>> Update([FromBody] UpdatePriorityDto dto, long id)
        {
            var response = await _priorityService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _priorityService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}