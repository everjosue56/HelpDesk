using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.RolesDto
{
    public class CreateRolDto
    {
        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
