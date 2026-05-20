using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.OrganizationsDto;
using HelpDesk.Services;
using HelpDesk.Services.Organizations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [ApiController]
    [Route("api/organizations")]

    [Authorize(Roles = "Administrador,TI")]
    public class OrganizationsController : ControllerBase
    {
        private readonly IOrganizationService _organizationService;

        public OrganizationsController(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] OrganizationFilterDto filter)
        {
            var response = await _organizationService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<OrganizationDto>>> GetById(long id)
        {
            var response = await _organizationService.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Roles = "Administrador,TI")]
        [HttpPost]
        public async Task<ActionResult<ResponseDto<OrganizationDto>>> Create(CreateOrganizationDto dto)
        {
            var response = await _organizationService.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Roles = "Administrador,TI")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<OrganizationDto>>> Update(UpdateOrganizationDto dto, long id)
        {
            var response = await _organizationService.UpdateAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Roles = "Administrador,TI")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _organizationService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}