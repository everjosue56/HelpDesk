using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.UsersDto
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "El primer nombre es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public required string LastName { get; set; }

        [Required(ErrorMessage = "El nombre de usuario (UserName) es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre de usuario debe tener entre 4 y 50 caracteres.", MinimumLength = 4)]
        [RegularExpression(@"^[a-zA-Z0-9_\.]+$", ErrorMessage = "El nombre de usuario solo puede contener letras, números, guiones bajos o puntos.")]
        public required string UserName { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        [StringLength(240, ErrorMessage = "El correo electrónico no puede exceder los 240 caracteres.")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [StringLength(100, ErrorMessage = "La contraseña debe tener entre 8 y 100 caracteres.", MinimumLength = 8)]
        [DataType(DataType.Password)]
        public required string Password { get; set; }

        [StringLength(13, ErrorMessage = "El teléfono no puede exceder los 13 caracteres.")]
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "El rol de usuario es obligatorio.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un rol válido.")]
        public long IdRol { get; set; }

        [Required(ErrorMessage = "La agencia es obligatoria.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar una agencia válida.")]
        public long IdAgency { get; set; }

        [Required(ErrorMessage = "El área es obligatoria.")]
        [Range(1, long.MaxValue, ErrorMessage = "Debe seleccionar un área válida.")]
        public long IdArea { get; set; }
    }
}
