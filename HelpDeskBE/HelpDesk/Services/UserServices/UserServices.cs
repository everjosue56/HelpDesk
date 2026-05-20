using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.UsersDto;
using HelpDesk.Helpers;
using HelpDesk.Services.UserServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;

        public UserService(ApplicationDbContext context, IMapper mapper, IConfiguration configuration, ILogger<UserService> logger)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
        }

        // --- GESTIÓN DE USUARIOS (CRUD) ---

        public async Task<PagedResponseDto<UserResponseDto>> GetAllAsync(UserFilterDto filter)
        {
            try
            {
                var query = _context.Users
                    .Include(u => u.Roles)
                    .Include(u => u.Agency)
                    .Include(u => u.Area)
                    .Where(u => u.IsActive)
                    .AsQueryable();
        
                if (filter.IdRol.HasValue)
                {
                    query = query.Where(u => u.IdRol == filter.IdRol.Value);
                }

                if (filter.IdAgency.HasValue)
                {
                    query = query.Where(u => u.IdAgency == filter.IdAgency.Value);
                }

                if (filter.IdArea.HasValue)
                {
                    query = query.Where(u => u.IdArea == filter.IdArea.Value);
                }

                if (!string.IsNullOrWhiteSpace(filter.Keyword))
                {
                    string term = filter.Keyword.Trim().ToLower();
                    query = query.Where(u => u.FirstName.ToLower().Contains(term)
                                           || u.LastName.ToLower().Contains(term)
                                           || u.UserName.ToLower().Contains(term)
                                           || u.Email.ToLower().Contains(term));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var usersDto = _mapper.Map<IEnumerable<UserResponseDto>>(entities);

                return new PagedResponseDto<UserResponseDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Listado de usuarios obtenido correctamente.",
                    Data = usersDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el listado de usuarios paginado.");
                return new PagedResponseDto<UserResponseDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los usuarios."
                };
            }
        }
        
        public async Task<ResponseDto<UserResponseDto>> GetByIdAsync(long id)
        {
            var user = await _context.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return new ResponseDto<UserResponseDto> { Status = false, Message = "Usuario no encontrado." };

            var data = _mapper.Map<UserResponseDto>(user);
            return new ResponseDto<UserResponseDto> { Data = data, Status = true };
        }

        public async Task<ResponseDto<UserResponseDto>> CreateAsync(UserRegisterDto userDto)
        {
            try
            {
                if (await EmailExistsAsync(userDto.Email))
                    return new ResponseDto<UserResponseDto> { Status = false, Message = "El correo ya está registrado." };

                CreatePasswordHash(userDto.Password, out byte[] hash, out byte[] salt);

                var userEntity = _mapper.Map<UserEntity>(userDto);
                userEntity.PasswordHash = hash;
                userEntity.PasswordSalt = salt;
                userEntity.IsActive = true;

                _context.Users.Add(userEntity);
                await _context.SaveChangesAsync();

                var userToReturn = await _context.Users
                .Include(u => u.Roles)
                .Include(u => u.Agency)
                .Include(u => u.Area)
                .FirstOrDefaultAsync(u => u.Id == userEntity.Id);

                await _context.Entry(userEntity).Reference(u => u.Roles).LoadAsync();
                var data = _mapper.Map<UserResponseDto>(userEntity);

                return new ResponseDto<UserResponseDto> { Data = _mapper.Map<UserResponseDto>(userToReturn), Status = true, Message = "Usuario creado exitosamente." };
            }
            catch (Exception ex)
            {
                return new ResponseDto<UserResponseDto> { Status = false, Message = $"Error interno: {ex.Message}" };
            }
        }   

        public async Task<ResponseDto<UserResponseDto>> UpdateAsync(long id, UpdateUserDto userDto)
        {
            var userEntity = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == id);

            if (userEntity == null)
                return new ResponseDto<UserResponseDto> { Status = false, Message = "Usuario no encontrado." };

            _mapper.Map(userDto, userEntity);

            if (!string.IsNullOrEmpty(userDto.Password))
            {
                CreatePasswordHash(userDto.Password, out byte[] hash, out byte[] salt);
                userEntity.PasswordHash = hash;
                userEntity.PasswordSalt = salt;
            }

            var updatedUser = await _context.Users
           .Include(u => u.Roles)
           .Include(u => u.Agency)
           .Include(u => u.Area)
           .FirstOrDefaultAsync(u => u.Id == id);

            _context.Users.Update(userEntity);
            await _context.SaveChangesAsync();

            var data = _mapper.Map<UserResponseDto>(userEntity);
            return new ResponseDto<UserResponseDto> { Data = _mapper.Map<UserResponseDto>(updatedUser), Status = true, Message = "Usuario actualizado." };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return new ResponseDto<bool> { Status = false, Data = false, Message = "Usuario no existe." };

            user.IsActive = false;
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, Data = true, Message = "Usuario desactivado correctamente." };
        }

        // --- AUTENTICACIÓN ---

        private string GenerateRefreshToken()
        {
            // Creamos un buffer de bytes
            var randomNumber = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
            }
            // Convertimos a Base64 para que sea un string seguro
            return Convert.ToBase64String(randomNumber);
        }

        public async Task<ResponseDto<TokenDto>> RefreshTokenAsync(string refreshToken)
        {
            var user = await _context.Users.Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            // Validamos existencia y expiración
            if (user == null || user.TokenExpires < DateTime.UtcNow)
            {
                return new ResponseDto<TokenDto>
                {
                    Status = false,
                    StatusCode = 401,
                    Message = "Token de refresco inválido o expirado."
                };
            }

            // 1. Generar los nuevos tokens
            string newToken = CreateToken(user);
            string newRefreshToken = GenerateRefreshToken(); // Generamos UNA sola vez

            // 2. Obtener configuración de expiración
            var daysStr = _configuration.GetSection("AppSettings:RefreshTokenExpiresDays").Value;
            var days = Convert.ToDouble(daysStr ?? "7");

            // 3. Actualizar el usuario con el MISMO token que le enviaremos
            user.RefreshToken = newRefreshToken;
            user.TokenCreated = DateTime.UtcNow;
            user.TokenExpires = DateTime.UtcNow.AddDays(days);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // 4. Retornar ambos tokens
            return new ResponseDto<TokenDto>
            {
                Status = true,
                StatusCode = 200,
                Data = new TokenDto
                {
                    Token = newToken,
                    RefreshToken = newRefreshToken
                },
                Message = "Token renovado con éxito."
            };
        }

        public async Task<ResponseDto<UserResponseDto>> LoginAsync(UserLoginDto loginDto)
        {
            var user = await _context.Users
            .Include(u => u.Roles) 
            .Include(u => u.Agency) 
            .Include(u => u.Area)   
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
                return new ResponseDto<UserResponseDto> { Status = false, Message = "Credenciales incorrectas." };

            var data = _mapper.Map<UserResponseDto>(user);
            data.Token = CreateToken(user);

            return new ResponseDto<UserResponseDto> { Data = data, Status = true, Message = "Inicio de sesión exitoso." };
        }

        // --- MÉTODOS PRIVADOS DE SEGURIDAD ---

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }

        private string CreateToken(UserEntity user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Roles?.Name ?? "User")  
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration.GetSection("AppSettings:TokenExpiresMinutes").Value ?? "60")),
                SigningCredentials = creds,
                NotBefore = DateTime.UtcNow
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public async Task<bool> EmailExistsAsync(string email) =>
            await _context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());

        public async Task<bool> UserNameExistsAsync(string userName) =>
            await _context.Users.AnyAsync(x => x.UserName.ToLower() == userName.ToLower());
    }
}