using HelpDesk.Database;
using HelpDesk.Dtos.AuthDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Services.EmailService;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BCrypt.Net;

namespace HelpDesk.Services.AuthService
{

public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger _logger;
        public AuthService(IHttpContextAccessor httpContextAccessor, ApplicationDbContext context, IEmailService email, ILogger<AuthService> logger)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _emailService = email;
            _logger = logger;
        }   

        public long GetUserId()
        {
            // 1. Obtenemos el claim del usuario logueado
            var userIdClaim = _httpContextAccessor.HttpContext?.User?
                .FindFirstValue(ClaimTypes.NameIdentifier);

            // 2. Intentamos convertirlo a long. Si falla o es nulo, devolvemos 0.
            return long.TryParse(userIdClaim, out long userId) ? userId : 0;
        }

        // 1. SOLICITAR RECUPERACIÓN (Mandar Código)
        public async Task<ResponseDto<bool>> ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

            // Por seguridad, si el correo no existe, respondemos true o un mensaje genérico
            if (user == null)
            {
                return new ResponseDto<bool> { Status = true, StatusCode = 200, Message = "Si el correo existe, se enviará un código de verificación.", Data = true };
            }

            // Generamos un código de 6 dígitos aleatorios
            var random = new Random();
            string verificationCode = random.Next(100000, 999999).ToString();

            // Guardamos el código y le damos 15 minutos de vida
            user.PasswordResetCode = verificationCode;
            user.ResetCodeExpiry = DateTime.Now.AddMinutes(15);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Disparamos el correo HTML con tu motor SMTP
            try
            {
                string clientName = $"{user.FirstName} {user.LastName}";

                // Template del correo que se le manda al usuario 
                string htmlBody = $@"
            <div style='font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                <h2 style='color: #0284c7; text-align: center;'>Financiera Codimersa HelpDesk</h2>
                <p>Hola, <strong>{clientName}</strong>,</p>
                <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código de verificación de un solo uso para continuar con el proceso:</p>
                <div style='background-color: #f0f9ff; border: 1px dashed #0284c7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0369a1; margin: 20px 0;'>
                    {verificationCode}
                </div>
                <p style='font-size: 12px; color: #666;'>Este código expirará en 15 minutos por razones de seguridad. Si tú no solicitaste este cambio, puedes ignorar este correo.</p>
            </div>";

                await _emailService.SendEmailAsync(
                    user.Email,
                    "🔒 Código de recuperación de contraseña - HelpDesk",
                    htmlBody
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al enviar el correo de recuperación a {Email}", user.Email);
                return new ResponseDto<bool> { Status = false, StatusCode = 500, Message = "Error al enviar el correo.", Data = false };
            }

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Message = "Código enviado con éxito.", Data = true };
        }

        // 2. APLICAR NUEVA CONTRASEÑA (Validar Código y Resetear)
        public async Task<ResponseDto<bool>> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

            if (user == null || user.PasswordResetCode != dto.Code)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 400, Message = "El código o el correo son inválidos.", Data = false };
            }

            // Validar si el código ya expiró
            if (user.ResetCodeExpiry < DateTime.Now)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 400, Message = "El código de verificación ha expirado.", Data = false };
            }
            // Generamos el nuevo Hash y la nueva Sal 
            using var hmac = new System.Security.Cryptography.HMACSHA512();

            // Asignamos los arreglos de bytes calculados a las propiedades reales de UserEntity
            user.PasswordSalt = hmac.Key;
            user.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(dto.NewPassword));

            // Limpiamos los campos de control para que el código de 6 dígitos muera y no se vuelva a usar
            user.PasswordResetCode = null;
            user.ResetCodeExpiry = null;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Message = "Contraseña restablecida con éxito.", Data = true };
        }
    }
}

