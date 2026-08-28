using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.SupplierDto;
using HelpDesk.Services.AgencyService;
using HelpDesk.Services.SupplierService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [Route("api/supplier")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SupplierFilterDto filter)
        {
            var response = await _supplierService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(long id)
        {
            var response = await _supplierService.GetByIdAsync(id);
            return response.Status ? Ok(response) : NotFound(response);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateSupplierDto dto)
        {
            var response = await _supplierService.CreateAsync(dto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromBody] UpdateSupplierDto dto, long id)
        {
            var response = await _supplierService.UpdateAsync(dto, id);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var response = await _supplierService.DeleteAsync(id);
            return response.Status ? Ok(response) : BadRequest(response);
        }
    }
}
