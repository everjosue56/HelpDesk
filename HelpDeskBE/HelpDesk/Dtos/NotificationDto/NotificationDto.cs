using System;

namespace HelpDesk.Dtos.NotificationDto
{
    public class NotificationDto
    {
        public long Id { get; set; }
        public string TextMessage { get; set; } = string.Empty;
        public DateTime? SentAt { get; set; }
        public bool IsRead { get; set; }
        public long IdReference { get; set; }
        public DateTime CreatedDate { get; set; }

        // --- Información del Usuario Destinatario ---
        public long IdUser { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty; 

        // --- Información del Tipo de Alerta / Canal ---
        public long IdAlertType { get; set; }
        public string AlertTypeName { get; set; } = string.Empty;
    }
}
