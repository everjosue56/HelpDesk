using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.SoftwareSystemDto
{
    public class CreateSoftwareSystemDto
    {
        [Required(ErrorMessage = "El nombre del sistema afectado es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
