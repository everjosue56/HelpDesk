using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceDto;

using HelpDesk.Services.MaintenanceService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
 

namespace HelpDesk.Api.Controllers
{
    [Route("api/maintenances")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class MaintenanceController : ControllerBase
    {
        private readonly IMaintenanceService _maintenanceService;


        public MaintenanceController(IMaintenanceService maintenanceService )
        {
            _maintenanceService = maintenanceService;
          
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] MaintenanceFilterDto filter)
        {
            var response = await _maintenanceService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }
 
        [HttpGet("calendar")]
        public async Task<ActionResult<ResponseDto<List<MaintenanceCalendarDto>>>> GetCalendar([FromQuery] int? year, [FromQuery] int? month)
        {
            var response = await _maintenanceService.GetMaintenanceCalendarAsync(year, month);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<MaintenanceDto>>> GetById(long id)
        {
            var response = await _maintenanceService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<MaintenanceDto>>> Create([FromBody] CreateMaintenanceDto dto)
        {
            var response = await _maintenanceService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<MaintenanceDto>>> Update([FromBody] UpdateMaintenanceDto dto, long id)
        {
            var response = await _maintenanceService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador, TI")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _maintenanceService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("{id}/renew")]
        public async Task<ActionResult<ResponseDto<MaintenanceDto>>> Renew(long id, [FromBody] RenewMaintenanceDto dto)
        {
            var response = await _maintenanceService.RenewAsync(id, dto);
            return StatusCode(response.StatusCode, response);
        }

   
    }
}