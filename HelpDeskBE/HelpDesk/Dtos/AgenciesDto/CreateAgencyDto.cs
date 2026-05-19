using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Dtos.AgenciesDto
{
    public class CreateAgencyDto
    {
        [Required(ErrorMessage = "El nombre de la agencia es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "La dirección de la agencia es obligatoria.")]
        [StringLength(240, ErrorMessage = "La dirección no puede exceder los 240 caracteres.")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "El número de teléfono es obligatorio.")]
        [Phone(ErrorMessage = "El formato del número de teléfono no es válido.")]
        [StringLength(13, ErrorMessage = "El teléfono no puede exceder los 13 caracteres.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        [StringLength(240, ErrorMessage = "El correo electrónico no puede exceder los 240 caracteres.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La organización asociada es obligatoria.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar una organización válida.")]
        public long IdOrganization { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
