using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("solutions_state")]
    public class SolutionStatusEntity : BaseEntity
    {
        [Column("name")]
        [Required]
        [MaxLength(60)]
        public string Name { get; set; } = string.Empty;
    }
}
