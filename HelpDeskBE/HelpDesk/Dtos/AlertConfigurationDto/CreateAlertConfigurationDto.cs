using System;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.AlertConfigurationDto
{
    public class CreateAlertConfigurationDto
    {
        [Required(ErrorMessage = "El título de la configuración es obligatorio.")]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "El asunto es obligatorio.")]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "La descripción o plantilla de la alerta es obligatoria.")]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public bool IsGlobal { get; set; }
        public bool IsActive { get; set; }

        public long? IdArea { get; set; }

        public long? IdAgency { get; set; }

        public DateTime? ScheduledDate { get; set; }
    }
}
