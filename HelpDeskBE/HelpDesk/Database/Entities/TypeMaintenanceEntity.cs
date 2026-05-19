using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("type_maintenance")]
    public class TypeMaintenanceEntity : BaseEntity
    {
        [Column("name")]
        [Required]
        [MaxLength(60)]
        public string Name { get; set; } = string.Empty;
        [Column("EstimatedTime")]
        [Required]
        public int EstimatedTime { get; set; }

    }
}
