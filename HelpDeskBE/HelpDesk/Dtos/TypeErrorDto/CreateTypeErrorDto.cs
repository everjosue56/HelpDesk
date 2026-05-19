using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.TypeErrorDto
{
    public class CreateTypeErrorDto
    {
        [Required(ErrorMessage = "El nombre de tipo de error es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
