using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("area")]
    public class AreaEntity: BaseEntity
    {
        [Column("name_area")]
        [Required]
        [MaxLength(60)]
        public string NameArea { get; set; } = string.Empty;

        [Column("is_active")]
        [Required]
        public bool IsActive { get; set; } = true;

        [Column("id_agency")]
        [Required]
        public long IdAgency { get; set; }

        // --- Relaciones ---

        // Relación con Agencia (Un área pertenece a una agencia)
        [ForeignKey(nameof(IdAgency))]
        public virtual AgencyEntity Agencies { get; set; } = null!;

        // Relación con Usuarios (Un área tiene muchos usuarios)
        public virtual ICollection<UserEntity> Users { get; set; } = new List<UserEntity>();
    }
}
