using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Services.AuditService;
using HelpDesk.Services.AuditServices; 
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/audit")]
    [ApiController]
    [Authorize(Roles = "TI,Administrador")]
    public class AuditController : ControllerBase
    {
        private readonly IAuditService _auditService;

        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AuditFilterDto pagination)
        {

            var response = await _auditService.GetAllAsync(pagination);
            return StatusCode(response.StatusCode, response);
        }
    }
}