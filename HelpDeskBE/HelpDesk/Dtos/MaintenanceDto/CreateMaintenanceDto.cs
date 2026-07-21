using System;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.MaintenanceDto
{
    public class CreateMaintenanceDto
    {
        [Required(ErrorMessage = "El tipo de mantenimiento es obligatorio.")]
        public long IdMaintenanceType { get; set; }

        [Required(ErrorMessage = "El área es obligatoria.")]
        public long IdArea { get; set; }

        [Required(ErrorMessage = "El dispositivo es obligatorio.")]
        public long IdDevice { get; set; }

        [Required(ErrorMessage = "La fecha de notificación es obligatoria.")]
        public DateTime NotificationDate { get; set; }

        public DateTime CompletionDate { get; set; }

        [Required(ErrorMessage = "Los detalles del mantenimiento son necesarios.")]
        [MaxLength(500)]
        public string Details { get; set; } = string.Empty;

        // Se puede enviar desde el front o calcular en el service
        public decimal ExecutionTime { get; set; }
        [Required (ErrorMessage = "La frecuencia es obligatoria.")]
        public long IdMaintenanceFrequency { get; set; }
    }
}
