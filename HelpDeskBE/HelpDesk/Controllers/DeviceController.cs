using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.DeviceDto;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Services.DeviceService;
using HelpDesk.Services.DeviceServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/devices")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService _deviceService;

        public DeviceController(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] DevicesFilterDto filter)
        {
            var response = await _deviceService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<DeviceDto>>> GetById(long id)
        {
            var response = await _deviceService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<DeviceDto>>> Create([FromBody] CreateDeviceDto dto)
        {
            var response = await _deviceService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<DeviceDto>>> Update([FromBody] UpdateDeviceDto dto, long id)
        {
            var response = await _deviceService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _deviceService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}