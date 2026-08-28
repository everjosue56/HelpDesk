using System;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.SupplierMeetingDto
{
    public class CreateSupplierMeetingDto
    {
        [Required(ErrorMessage ="El proveedor el obligatorio")]
        public long IdSupplier {  get; set; }
        [MaxLength(500, ErrorMessage ="La descripcion es obligatoria.")]
        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage = "La razon del trabajo es obligatorio.")]
        [MaxLength(500, ErrorMessage = "Rason del trabajo no se puede exceder de 500 caracteres.")]
        public string ReasonWork { get; set; } = string.Empty;
        public string Evidence { get; set; } = string.Empty;
        [Required(ErrorMessage ="La fecha es obligatoria.")]
        public DateTime MeetingDate { get; set; } 

    }
}
