using System;

namespace HelpDesk.Dtos.TicketDto
{
    public class TicketDto
    {
        public long Id { get; set; }
        public DateTime ReportDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        // Datos del Usuario
        public long IdUser { get; set; }
        public string UserName { get; set; } = string.Empty;

        // Datos del Tipo de Error
        public long IdTypeError { get; set; }
        public string TypeErrorName { get; set; } = string.Empty;

        // Datos del Área
        public long IdArea { get; set; }
        public string AreaName { get; set; } = string.Empty;

        // Datos del Sistema
        public long IdSoftwareSystem { get; set; }
        public string SoftwareSystemName { get; set; } = string.Empty;

        // Datos de Impacto
        public long IdImpact { get; set; }
        public string ImpactName { get; set; } = string.Empty;

        // Datos de Prioridad
        public long IdPriority { get; set; }
        public string PriorityName { get; set; } = string.Empty;
    }
}