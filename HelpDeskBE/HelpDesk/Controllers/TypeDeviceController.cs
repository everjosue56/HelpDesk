using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TypeDevicesDto;
using HelpDesk.Services.TypeDeviceService;
using HelpDesk.Services.TypeDeviceServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/type-devices")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class TypeDeviceController : ControllerBase
    {
        private readonly ITypeDevicesService _typeDeviceService;

        public TypeDeviceController(ITypeDevicesService typeDeviceService)
        {
            _typeDeviceService = typeDeviceService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<IEnumerable<TypeDevicesDto>>>> GetAll()
        {
            var response = await _typeDeviceService.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<TypeDevicesDto>>> GetById(long id)
        {
            var response = await _typeDeviceService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<TypeDevicesDto>>> Create([FromBody] CreateTypeDevicesDto dto)
        {
            var response = await _typeDeviceService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<TypeDevicesDto>>> Update([FromBody] UpdateTypeDevicesDto dto, long id)
        {
            var response = await _typeDeviceService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _typeDeviceService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}