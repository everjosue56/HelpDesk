using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.UsersDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.UserServices
{
    public interface IUserService
    {
        // --- Gestión de Usuarios (CRUD) ---
        Task<PagedResponseDto<UserResponseDto>> GetAllAsync(UserFilterDto filter);
        Task<ResponseDto<UserResponseDto>> GetByIdAsync(long id);
        Task<ResponseDto<UserResponseDto>> CreateAsync(UserRegisterDto userDto);
        Task<ResponseDto<UserResponseDto>> UpdateAsync(long id, UpdateUserDto userDto);
        Task<ResponseDto<bool>> DeleteAsync(long id);

        // --- Autenticación ---
        Task<ResponseDto<UserResponseDto>> LoginAsync(UserLoginDto loginDto);

        // --- Utilidades ---
        Task<bool> EmailExistsAsync(string email);
        Task<bool> UserNameExistsAsync(string userName);

        // ---RefeshToken ---
        Task<ResponseDto<TokenDto>> RefreshTokenAsync(string refreshToken);
    }
}
