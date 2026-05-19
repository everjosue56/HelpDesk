using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.TypeMaintenanceDto
{
    public class CreateTypeMaintenanceDto
    {

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El tiempo estimado es obligatorio.")]
        [Range(1, 10080, ErrorMessage = "El tiempo estimado debe ser de al menos 1 minuto y no exceder una semana (10,080 minutos).")]
        public int EstimatedTime { get; set; }
    }
}
