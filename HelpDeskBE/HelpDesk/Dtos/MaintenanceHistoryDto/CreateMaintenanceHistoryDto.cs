using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Dtos.MaintenanceHistoryDto
{
    public class CreateMaintenanceHistoryDto
    {
        [Required(ErrorMessage = "El registro de mantenimiento es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un mantenimiento válido.")]
        public long IdMaintenance { get; set; }

        [Required(ErrorMessage = "El dispositivo es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un dispositivo válido.")]
        public long IdDevice { get; set; }

        [Required(ErrorMessage = "El usuario asignado es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un usuario válido.")]
        public long IdUser { get; set; }

        [Required(ErrorMessage = "El tiempo de solución es obligatorio.")]
        [Range(0.1, 999.99, ErrorMessage = "El tiempo de solución debe ser un valor mayor a cero.")]
        public decimal SolutionTime { get; set; }
    }
}
