using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("type_error")]
    public class TypeErrorEntity: BaseEntity
    {
        [Column("name")]
        [MaxLength(60)]
        public string Name { get; set; } = string.Empty;
    }
}
