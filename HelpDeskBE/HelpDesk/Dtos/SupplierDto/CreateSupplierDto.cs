using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace HelpDesk.Dtos.SupplierDto
{
    public class CreateSupplierDto
    {
        [Required(ErrorMessage ="El id de organizacion es obligatorio.")]
        public long IdOrganization { get; set; }
        [Required(ErrorMessage = "La descripcion es obligatoria.")]
        [MaxLength(500, ErrorMessage = "La descripcion no puede exceder de los 500 caracteres.")]
        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage = "El nombre de proveedor es obligatorio")]
        [MaxLength(60, ErrorMessage ="El nombre del proveedor no puede exceder de los 60 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre del contacto es obligatorio.")]
        [MaxLength(60, ErrorMessage = "El nombre del contacto no puede exceder los 60 caracteres.")]
        public string Contact { get; set; } = string.Empty;

        [MaxLength(240, ErrorMessage = "El correo electronico no puede exceder los 240 caracteres.")]
        public string Email { get; set; } = string.Empty;

        [MaxLength(13, ErrorMessage ="El numero de telefono es obligatorio.")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage ="La fecha de registro es obligatoria.")]
        public DateTime RegistrationDate { get; set; }

        [Required(ErrorMessage ="La Ubicacion es obligatoria.")]
        [MaxLength(240, ErrorMessage = "La ubicacion no puede exceder los 240 caracteres")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage ="El cumplimiento es obligatorio")]
        public bool Compliance {  get; set; }

        [Required(ErrorMessage ="El estado es obligatorio")]
        public bool IsActive { get; set; }


    }
}
