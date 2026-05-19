using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("roles")]
    public class RolEntity : BaseEntity
    {
        [Column("type")]
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        // Propiedad de navegación inversa
        public virtual ICollection<UserEntity> Users { get; set; } = new List<UserEntity>();
    }
}
