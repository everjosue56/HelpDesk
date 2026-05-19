using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.SoftwareSystemDto;
using HelpDesk.Services.SoftwareSystemServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/software-systems")]
    [ApiController]
    [Authorize] // Requiere autenticación para cualquier operación
    public class SoftwareSystemController : ControllerBase
    {
        private readonly ISoftwareSystemService _softwareSystemService;

        public SoftwareSystemController(ISoftwareSystemService softwareSystemService)
        {
            _softwareSystemService = softwareSystemService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<SoftwareSystemDto>>>> GetAll()
        {
            var response = await _softwareSystemService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<SoftwareSystemDto>>> GetById(long id)
        {
            var response = await _softwareSystemService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,TI")] // Solo administradores o TI crean sistemas
        public async Task<ActionResult<ResponseDto<SoftwareSystemDto>>> Create([FromBody] CreateSoftwareSystemDto dto)
        {
            var response = await _softwareSystemService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<SoftwareSystemDto>>> Update([FromBody] UpdateSoftwareSystemDto dto, long id)
        {
            var response = await _softwareSystemService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador,TI")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _softwareSystemService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}