using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceFrequencyDto;
using HelpDesk.Services.MaintenanceFrequncyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [Route("api/maintenance-frequency")]
    [ApiController]
    [Authorize(Roles = "Administrador, TI")]
    public class MaintenanceFrequencyController : ControllerBase
    {
        private readonly IMaintenanceFrequencyService _frequencyService;

        public MaintenanceFrequencyController(IMaintenanceFrequencyService frequencyService)
        {
            _frequencyService = frequencyService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponseDto<MaintenanceFrequencyDto>>> GetAll([FromQuery] MaintenanceFrequencyFilterDto filter) 
        {
            var response = await _frequencyService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<MaintenanceFrequencyDto>>> GetById(long id)
        {
            var response = await _frequencyService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<MaintenanceFrequencyDto>>> Create([FromBody] CreateMaintenanceFrequencyDto dto) 
        {
            var response = await _frequencyService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response); 
        }

        [HttpPut]
        public async Task<ActionResult<ResponseDto<MaintenanceFrequencyDto>>> Update([FromBody] UpdateMaintenanceFrequecyDto dto, long id) 
        {
            var response = await _frequencyService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id) 
        {
            var response = await _frequencyService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }

    }
}
