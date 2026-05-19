using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.ResolutionDto;
using HelpDesk.Services.ResolutionService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/resolutions")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")] // Restricción global para todo el controlador
    public class ResolutionController : ControllerBase
    {
        private readonly IResolutionService _resolutionService;

        public ResolutionController(IResolutionService resolutionService)
        {
            _resolutionService = resolutionService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<ResolutionDto>>>> GetAll()
        {
            var response = await _resolutionService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<ResolutionDto>>> GetById(long id)
        {
            var response = await _resolutionService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<ResolutionDto>>> Create([FromBody] CreateResolutionDto dto)
        {
            var response = await _resolutionService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<ResolutionDto>>> Update([FromBody] UpdateResolutionDto dto, long id)
        {
            var response = await _resolutionService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _resolutionService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}