using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.AreaDto
{
    public class CreateAreaDto
    {
        [Required(ErrorMessage = "El nombre del Area es obligatorio.")]
        [StringLength(60, ErrorMessage = "El nombre no puede exceder los 60 caracteres.")]
        public string NameArea { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public long IdAgency { get; set; }
    }
}
