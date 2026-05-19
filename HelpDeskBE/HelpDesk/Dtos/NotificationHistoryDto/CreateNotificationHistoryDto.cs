using System;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.NotificationHistoryDto
{
    public class CreateNotificationHistoryDto
    {
        [Required(ErrorMessage = "El notificación es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar una notificacion válida.")]
        public long IdNotification { get; set; }
        public DateTime ActionDate { get; set; }

    }
}
