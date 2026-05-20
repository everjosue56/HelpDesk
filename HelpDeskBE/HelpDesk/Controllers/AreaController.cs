using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Services.AreaServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/areas")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class AreaController : ControllerBase
    {
        private readonly IAreaService _areaService;

        public AreaController(IAreaService areaService)
        {
            _areaService = areaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AreaFilterDto pagination)
        {
            var response = await _areaService.GetAllAsync(pagination);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<AreaDto>>> GetById(long id)
        {
            var response = await _areaService.GetByIdAsync(id);
            return response.Status ? Ok(response) : NotFound(response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<AreaDto>>> Create([FromBody] CreateAreaDto dto)
        {
            var response = await _areaService.CreateAsync(dto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<AreaDto>>> Update([FromBody] UpdateAreaDto dto, long id)
        {
            var response = await _areaService.UpdateAsync(dto, id);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _areaService.DeleteAsync(id);
            return response.Status ? Ok(response) : BadRequest(response);
        }
    }
}