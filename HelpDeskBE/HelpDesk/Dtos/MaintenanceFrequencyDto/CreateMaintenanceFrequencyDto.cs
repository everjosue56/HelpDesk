using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Dtos.MaintenanceFrequencyDto
{
    public class CreateMaintenanceFrequencyDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(60)]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "La tiempo de frecuencia es obligatorio")]
        public int DaysInterval { get; set; }
    }
}
