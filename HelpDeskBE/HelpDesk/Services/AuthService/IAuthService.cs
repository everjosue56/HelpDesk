using HelpDesk.Dtos.AuthDto;
using HelpDesk.Dtos.Common;
using System.Threading.Tasks;

namespace HelpDesk.Services.AuthService
{
    public interface IAuthService
    {
        long GetUserId ();
        Task<ResponseDto<bool>> ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<ResponseDto<bool>> ResetPasswordAsync(ResetPasswordDto dto);
    }
}
