using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace HelpDesk.Database.Entities
{
    [Table("type_device")]
    public class TypeDeviceEntity : BaseEntity
    {
        [Column("name")]
        [MaxLength(60)]
        [Required]
        public string Name { get; set; } = string.Empty;
        [Column("description")]
        [MaxLength(240)]
        public string Description { get; set; } = string.Empty;
    }
}
