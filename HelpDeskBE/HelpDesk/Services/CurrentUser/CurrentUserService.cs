using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace HelpDesk.Services.Common
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUserName()
        {
            // Busca el NameIdentifier o el Name del token JWT, si no hay, es un proceso del "Sistema"
            var name = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value;
            var nameId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return name ?? nameId ?? "Sistema/Anónimo";
        }
    }
}