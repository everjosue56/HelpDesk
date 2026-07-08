using System;

namespace HelpDesk.Dtos.ResolutionDto
{
    public class ResolutionDto
    {
        public long Id { get; set; }
        public long IdTicket { get; set; }
        public string ActionTaken { get; set; } = string.Empty;
        public DateTime ResolutionDate { get; set; }
        public string RootCause { get; set; } = string.Empty;
        public string PreventiveMeasures { get; set; } = string.Empty;
        public string Observation { get; set; } = string.Empty;
        public string? SecondObservation { get; set; } 
        public decimal SolutionTime { get; set; }
        public DateTime CreatedDate { get; set; }

        // Datos del Usuario que resolvió
        public long IdUser { get; set; }
        public string UserName { get; set; } = string.Empty;

        // Datos del Estado de la Solución
        public long IdSolutionStatus { get; set; }
        public string SolutionStatusName { get; set; } = string.Empty;

        // Datos del Dispositivo
        public long? IdDevice { get; set; }
        public string DeviceName { get; set; } = string.Empty;

        // Prioridad final (por si cambió durante la resolución)
        public long IdPriority { get; set; }
        public string PriorityName { get; set; } = string.Empty;

        public string TicketDescription { get; set; } = string.Empty;
        public string TicketCreatorName { get; set; } = string.Empty; // El usuario que reportó el fallo
        public string TicketAreaName { get; set; } = string.Empty;
    }
}
