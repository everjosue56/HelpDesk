using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Dtos.NotificationDto
{
    public class CreateNotificationDto
    {
        [Required(ErrorMessage = "El usuario destino de la notificación es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un usuario válido.")]
        public long IdUser { get; set; }

        [Required(ErrorMessage = "El tipo de alerta es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un tipo de alerta válido.")]
        public long IdAlertType { get; set; }

        [Required(ErrorMessage = "El mensaje de la notificación es obligatorio.")]
        [StringLength(500, ErrorMessage = "El mensaje no puede exceder los 500 caracteres.")]
        public string TextMessage { get; set; } = string.Empty;

        [Required(ErrorMessage = "El ID de referencia es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe proporcionar un ID de referencia válido.")]
        public long IdReference { get; set; }
    }
}
