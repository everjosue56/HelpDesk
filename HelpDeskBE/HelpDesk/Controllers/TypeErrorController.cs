using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TypeErrorDto;
using HelpDesk.Services.TypeError;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Api.Controllers
{
    [Route("api/type-errors")]
    [ApiController]
    // Protegemos el catálogo para que solo personal autorizado lo gestione
    [Authorize(Roles = "Administrador,TI")]
    public class TypeErrorController : ControllerBase
    {
        private readonly ITypeErrorService _typeErrorService;

        public TypeErrorController(ITypeErrorService typeErrorService)
        {
            _typeErrorService = typeErrorService;
        }

        [HttpGet]
        [AllowAnonymous] // Permitimos que cualquier usuario autenticado vea los tipos de error al crear un ticket
        public async Task<ActionResult<ResponseDto<IEnumerable<TypeErrorDto>>>> GetAll()
        {
            var response = await _typeErrorService.GetAllAsync();
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<TypeErrorDto>>> GetById(long id)
        {
            var response = await _typeErrorService.GetByIdAsync(id);
            return response.Status ? Ok(response) : NotFound(response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<TypeErrorDto>>> Create([FromBody] CreateTypeErrorDto dto)
        {
            var response = await _typeErrorService.CreateAsync(dto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<TypeErrorDto>>> Update([FromBody] UpdateTypeErrorDto dto, long id)
        {
            var response = await _typeErrorService.UpdateAsync(dto, id);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<bool>>> Delete(long id)
        {
            var response = await _typeErrorService.DeleteAsync(id);
            return response.Status ? Ok(response) : BadRequest(response);
        }
    }
}