using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.TypeDevicesDto
{
    public class CreateTypeDevicesDto
    {
        [Required(ErrorMessage = "El nombre del tipo de dispositivo es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(240, ErrorMessage = "La descripción no puede exceder los 240 caracteres.")]
        public string Description { get; set; } = string.Empty;
    }
}
