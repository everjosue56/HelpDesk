using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.ImpactDto;
using HelpDesk.Dtos.PriorityDto;
using HelpDesk.Dtos.SolutionStateDto;
using HelpDesk.Services.ImpactServices;
using HelpDesk.Services.PriorityServices;
using HelpDesk.Services.SolutionStateServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/solution_state")]
    [ApiController]
    [Authorize] // Requiere estar autenticado
    public class SolutionStateController : ControllerBase
    {
        private readonly ISolutionStateService _solutionStateService;

        public SolutionStateController(ISolutionStateService solutionStateService)
        {
            _solutionStateService = solutionStateService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<SolutionStateDto>>>> GetAll()
        {
            var response = await _solutionStateService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<SolutionStateDto>>> GetById(long id)
        {
            var response = await _solutionStateService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,TI")] // Solo niveles altos pueden crear
        public async Task<ActionResult<ResponseDto<SolutionStateDto>>> Create([FromBody] CreateSolutionStateDto dto)
        {
            var response = await _solutionStateService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<SolutionStateDto>>> Update([FromBody] UpdateSolutionStateDto dto, long id)
        {
            var response = await _solutionStateService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _solutionStateService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}