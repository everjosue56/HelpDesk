using System.Threading.Tasks;

namespace HelpDesk.Services.EmailService
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string htmlBody);
    }
}
