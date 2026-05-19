using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.ImpactDto
{
    public class CreateImpactDto
    {
        [Required(ErrorMessage = "El nombre del impacto es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
