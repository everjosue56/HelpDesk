using HelpDesk.Config;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System;
using System.Threading.Tasks;

namespace HelpDesk.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

            using var smtp = new SmtpClient();
            try
            {
                smtp.Timeout = 5000;
                await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, SecureSocketOptions.Auto);
                // await smtp.ConnectAsync("smtp.gmail.com", 465, SecureSocketOptions.Auto);
                await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                // await smtp.AuthenticateAsync("elever744@gmail.com", "zzxerdkqmsyjhipw");
                await smtp.SendAsync(email);

                _logger.LogInformation("Correo enviado exitosamente a {To}", toEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Falla en el envío de correo. Detalles: {Message}", ex.Message);
                return false;
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }

        }
    }
}