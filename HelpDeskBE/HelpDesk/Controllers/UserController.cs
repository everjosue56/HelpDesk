using HelpDesk.Dtos.UsersDto;
using HelpDesk.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var response = await _userService.LoginAsync(loginDto);
            if (!response.Status)
            {
                return Unauthorized(response);
            }
            return Ok(response);
        }

        [HttpGet]
       [Authorize(Roles = "Administrador")] // Solo admins pueden ver la lista completa
        public async Task<ActionResult> GetAll()
        {
            var response = await _userService.GetAllAsync();
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> GetById(long id)
        {
            var response = await _userService.GetByIdAsync(id);
            if (!response.Status)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost("register")]
        [AllowAnonymous] // Permitir que nuevos usuarios se registren
        public async Task<ActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            var response = await _userService.CreateAsync(registerDto);
            if (!response.Status)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> Update(long id, [FromBody] UpdateUserDto updateDto)
        {
            var response = await _userService.UpdateAsync(id, updateDto);
            if (!response.Status)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> Delete(long id)
        {
            var response = await _userService.DeleteAsync(id);
            if (!response.Status)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous] // El usuario no tiene JWT válido, por eso ocupa refrescar
        public async Task<ActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var response = await _userService.RefreshTokenAsync(refreshToken);
            if (!response.Status) return Unauthorized(response);

            return Ok(response);
        }
    }
}