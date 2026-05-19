using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.AlertTypeDto
{
    public class CreateAlertTypeDto
    {
        [Required(ErrorMessage = "El nombre del tipo de alerta es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
