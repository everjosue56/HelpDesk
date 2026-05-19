using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.SolutionStateDto
{
    public class CreateSolutionStateDto
    {
        [Required(ErrorMessage = "El nombre del estado de solucion es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
