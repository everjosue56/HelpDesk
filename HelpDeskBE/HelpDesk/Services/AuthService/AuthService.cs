using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace HelpDesk.Services.AuthService
{

public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }   

        public long GetUserId()
        {
            // 1. Obtenemos el claim del usuario logueado
            var userIdClaim = _httpContextAccessor.HttpContext?.User?
                .FindFirstValue(ClaimTypes.NameIdentifier);

            // 2. Intentamos convertirlo a long. Si falla o es nulo, devolvemos 0.
            return long.TryParse(userIdClaim, out long userId) ? userId : 0;
        }
    }
}

