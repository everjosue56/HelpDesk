using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.PriorityDto
{
    public class CreatePriorityDto
    {
        [Required(ErrorMessage = "El tipo de prioiridad es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
