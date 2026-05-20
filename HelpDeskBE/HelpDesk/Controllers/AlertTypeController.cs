// Api/Controllers/AlertTypeController.cs
using HelpDesk.Dtos.AlertTypeDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Services.AlertTypeService;
using HelpDesk.Services.AlertTypeServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/alert-types")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class AlertTypeController : ControllerBase
    {
        private readonly IAlertTypeService _alertTypeService;

        public AlertTypeController(IAlertTypeService alertTypeService)
        {
            _alertTypeService = alertTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AlertTypeFilterDto filter)
        {
            var response = await _alertTypeService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<AlertTypeDto>>> GetById(long id)
        {
            var response = await _alertTypeService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<AlertTypeDto>>> Create([FromBody] CreateAlertTypeDto dto)
        {
            var response = await _alertTypeService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<AlertTypeDto>>> Update([FromBody] UpdateAlertTypeDto dto, long id)
        {
            var response = await _alertTypeService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _alertTypeService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}