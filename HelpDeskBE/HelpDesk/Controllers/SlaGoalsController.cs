using HelpDesk.Dtos.SLA;
using HelpDesk.Services.SlaService;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [ApiController]
    [Route("api/sla-goals")]
    public class SlaGoalsController : ControllerBase
    {
        private readonly ISlaGoalService _slaGoalService;

        public SlaGoalsController(ISlaGoalService slaGoalService)
        {
            _slaGoalService = slaGoalService;
        }

        [HttpPost]
        public async Task<IActionResult> SaveGoal([FromBody] SaveSlaGoalDto dto)
        {
            var result = await _slaGoalService.SaveAsync(dto);
            return StatusCode(result.StatusCode, result);
        }
    }
}