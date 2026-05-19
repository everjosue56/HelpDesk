using System;

namespace HelpDesk.Dtos.NotificationHistoryDto
{
    public class NotificationHistoryDto
    {
        public long Id { get; set; }
        public long IdUser { get; set; }
        public long IdNotification { get; set; }
        public DateTime ActionDate { get; set; }

        // --- Datos de usuario ---
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;

        // --- Datos de Notification ---
        public long IdReference { get; set; }
        public bool IsRead { get; set; }
        public string TextMessage { get; set; } = string.Empty;

    }
}
