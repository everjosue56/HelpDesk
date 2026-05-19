using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.OrganizationsDto
{
    public class CreateOrganizationDto
    {
        [Required(ErrorMessage = "El nombre de la organización es obligatorio.")]
        [StringLength(60)]
        public string Name { get; set; } = string.Empty;
        public string? Logo { get; set; }

        [Required(ErrorMessage = "El número de contacto es necesario.")]
        [StringLength(13)]
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Description { get; set; }

        [Required(ErrorMessage = "La dirección física es obligatoria.")]
        [StringLength(240)]
        public string Address { get; set; } = string.Empty;
    }
}
