using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TypeMaintenanceDto;
using HelpDesk.Services.TypeMaintenanceService;
using HelpDesk.Services.TypeMaintenanceServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/type-maintenances")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class TypeMaintenanceController : ControllerBase
    {
        private readonly ITypeMaintenanceService _typeMaintenanceService;

        public TypeMaintenanceController(ITypeMaintenanceService typeMaintenanceService)
        {
            _typeMaintenanceService = typeMaintenanceService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<TypeMaintenanceDto>>>> GetAll()
        {
            var response = await _typeMaintenanceService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<TypeMaintenanceDto>>> GetById(long id)
        {
            var response = await _typeMaintenanceService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<TypeMaintenanceDto>>> Create([FromBody] CreateTypeMaintenanceDto dto)
        {
            var response = await _typeMaintenanceService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<TypeMaintenanceDto>>> Update([FromBody] UpdateTypeMaintenanceDto dto, long id)
        {
            var response = await _typeMaintenanceService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _typeMaintenanceService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}