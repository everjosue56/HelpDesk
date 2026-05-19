using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.AlertConfigurationDto;
using HelpDesk.Services.AlertConfigurationService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/alert-configurations")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class AlertConfigurationController : ControllerBase
    {
        private readonly IAlertConfigurationService _configurationService;

        public AlertConfigurationController(IAlertConfigurationService configurationService)
        {
            _configurationService = configurationService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<AlertConfigurationDto>>>> GetAll()
        {
            var response = await _configurationService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<AlertConfigurationDto>>> GetById(long id)
        {
            var response = await _configurationService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<AlertConfigurationDto>>> Create([FromBody] CreateAlertConfigurationDto dto)
        {
            var response = await _configurationService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<AlertConfigurationDto>>> Update([FromBody] UpdateAlertConfigurationDto dto, long id)
        {
            var response = await _configurationService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _configurationService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}