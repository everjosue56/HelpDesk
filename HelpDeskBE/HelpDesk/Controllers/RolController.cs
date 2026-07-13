using HelpDesk.Dtos.RolesDto;
using HelpDesk.Services.RolServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [ApiController]
    [Route("api/roles")]
    [Authorize(Roles = "Administrador, TI")] 
    public class RolesController : ControllerBase
    {
        private readonly IRolService _rolService;

        public RolesController(IRolService rolService)
        {
            _rolService = rolService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var response = await _rolService.GetAllAsync();
            return Ok(response);
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(long id)
        {
            var response = await _rolService.GetByIdAsync(id);
            if (!response.Status)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [Authorize(Roles = "Administrador")]
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateRolDto createDto)
        {
            var response = await _rolService.CreateAsync(createDto);
            if (!response.Status)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [Authorize(Roles = "Administrador")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(long id, [FromBody] UpdateRolDto updateDto)
        {
            var response = await _rolService.UpdateAsync(updateDto, id);
            if (!response.Status)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [Authorize(Roles = "Administrador")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var response = await _rolService.DeleteAsync(id);
            if (!response.Status)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}