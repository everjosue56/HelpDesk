using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.ImpactDto;
using HelpDesk.Services.ImpactServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/impacts")]
    [ApiController]
    [Authorize] 
    public class ImpactController : ControllerBase
    {
        private readonly IImpactService _impactService;

        public ImpactController(IImpactService impactService)
        {
            _impactService = impactService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ImpactFilterDto filter)
        {
            var response = await _impactService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<ImpactDto>>> GetById(long id)
        {
            var response = await _impactService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,TI")] // Solo niveles altos pueden crear
        public async Task<ActionResult<ResponseDto<ImpactDto>>> Create([FromBody] CreateImpactDto dto)
        {
            var response = await _impactService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<ImpactDto>>> Update([FromBody] UpdateImpactDto dto, long id)
        {
            var response = await _impactService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _impactService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}