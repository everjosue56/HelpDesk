using System;

namespace HelpDesk.Dtos.TicketHistory
{
    public class TicketHistoryDto
    {
        public long Id { get; set; }
        public DateTime CloseDate { get; set; }

        // --- Información del Ticket  ---
        public long IdTicket { get; set; }
        public string TicketDescription { get; set; } = string.Empty;
        public string SoftwareSystemName { get; set; } = string.Empty;

        // --- Información de la Resolución ---
        public long IdResolution { get; set; }
        public string ActionTaken { get; set; } = string.Empty;
        public string RootCause { get; set; } = string.Empty;
        public decimal SolutionTime { get; set; }

        // --- Información del Usuario ---
        public long IdUser { get; set; }
        public string UserName { get; set; } = string.Empty;
    }
}
