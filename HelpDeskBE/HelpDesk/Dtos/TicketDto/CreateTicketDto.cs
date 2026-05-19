using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.TicketDto
{
    public class CreateTicketDto
    {
        [Required(ErrorMessage = "La descripción del problema o falla es obligatoria.")]
        [StringLength(360, ErrorMessage = "La descripción no puede exceder los 360 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "El tipo de falla o error es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un tipo de error válido.")]
        public long IdTypeError { get; set; }

        [Required(ErrorMessage = "El sistema de software afectado es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un sistema de software válido.")]
        public long IdSoftwareSystem { get; set; }

        [Required(ErrorMessage = "El impacto del ticket es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un impacto válido.")]
        public long IdImpact { get; set; }

        [Required(ErrorMessage = "La prioridad inicial es obligatoria.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar una prioridad válida.")]
        public long IdPriority { get; set; }

        [Required(ErrorMessage = "El área que reporta el ticket es obligatoria.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un área válida.")]
        public long IdArea { get; set; }

        public bool IsActive { get; set; } = true;

        // report date se obtendra al momento de crear un ticket 

    }
}
