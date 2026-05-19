using System;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.AlertHistoryDto
{
    public class CreateAlerHistoryDto
    {
        [Required(ErrorMessage = "La configuración de la alerta es obligatoria.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar una configuración de alerta válida.")]
        public long IdAlertConfiguration { get; set; }

        [Required(ErrorMessage = "El usuario asociado a la acción es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un usuario válido.")]
        public long IdUser { get; set; }

        [Required(ErrorMessage = "La fecha de la acción es obligatoria.")]
        [DataType(DataType.DateTime, ErrorMessage = "El formato de la fecha no es válido.")]
        public DateTime ActionDate { get; set; }
    }
}
