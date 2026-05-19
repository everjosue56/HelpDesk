using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Services.AgencyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/agencies")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class AgencyController : ControllerBase
    {
        private readonly IAgencyService _agencyService;

        public AgencyController(IAgencyService agencyService)
        {
            _agencyService = agencyService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var response = await _agencyService.GetAllAsync();
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(long id)
        {
            var response = await _agencyService.GetByIdAsync(id);
            return response.Status ? Ok(response) : NotFound(response);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateAgencyDto dto)
        {
            var response = await _agencyService.CreateAsync(dto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromBody] UpdateAgencyDto dto, long id)
        {
            var response = await _agencyService.UpdateAsync(dto, id);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var response = await _agencyService.DeleteAsync(id);
            return response.Status ? Ok(response) : BadRequest(response);
        }
    }
}