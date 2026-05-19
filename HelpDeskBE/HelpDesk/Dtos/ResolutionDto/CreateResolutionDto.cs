using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.ResolutionDto
{
    public class CreateResolutionDto
    {
        [Required(ErrorMessage = "El ticket asociado es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un ticket válido.")]
        public long IdTicket { get; set; }

        [Required(ErrorMessage = "La acción tomada para resolver el ticket es obligatoria.")]
        [StringLength(500, ErrorMessage = "La acción tomada no puede exceder los 500 caracteres.")]
        public string ActionTaken { get; set; } = string.Empty;

        [Required(ErrorMessage = "El estado de la solución es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un estado de solución válido.")]
        public long IdSolutionStatus { get; set; }

        [Required(ErrorMessage = "La causa raíz del problema es obligatoria.")]
        [StringLength(500, ErrorMessage = "La causa raíz no puede exceder los 500 caracteres.")]
        public string RootCause { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Las medidas preventivas no pueden exceder los 500 caracteres.")]
        public string PreventiveMeasures { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "La observación no puede exceder los 500 caracteres.")]
        public string Observation { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "La segunda observación no puede exceder los 500 caracteres.")]
        public string SecondObservation { get; set; } = string.Empty;

        [Required(ErrorMessage = "La prioridad final es obligatoria.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar una prioridad válida.")]
        public long IdPriority { get; set; }

        [Required(ErrorMessage = "El dispositivo afectado es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un dispositivo válido.")]
        public long IdDevice { get; set; }

        [Required(ErrorMessage = "El tiempo invertido en la solución es obligatorio.")]
        [Range(0.1, 999.99, ErrorMessage = "El tiempo de solución debe ser un valor mayor a cero.")]
        public decimal SolutionTime { get; set; }
    }
}
