using System;

namespace HelpDesk.Dtos.AlertHistoryDto
{
    public class AlertHistoryDto
    {
        public long Id { get; set; }
        public DateTime ExecutionDate { get; set; }

        // --- Datos de la Regla de Alerta ---
        public long IdAlertConfiguration { get; set; }
        public string AlertTitle { get; set; } = string.Empty;
        public string AlertSubject { get; set; } = string.Empty;

        // --- Datos del Usuario Emisor ---
        public long IdUser { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
    }
}
