using System;

namespace HelpDesk.Dtos.AlertConfigurationDto
{
    public class AlertConfigurationDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsGlobal { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public DateTime CreatedDate { get; set; }

        // --- Datos de Relaciones ---
        public long? IdArea { get; set; }
        public string AreaName { get; set; } = string.Empty;

        public long? IdAgency { get; set; }
        public string AgencyName { get; set; } = string.Empty;
    }
}
