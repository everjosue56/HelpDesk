using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    public class AgencyEntity : BaseEntity
    {
        [Column("name")]
        [Required]
        [MaxLength(60)]
        public string Name { get; set; } = string.Empty;
        [Column("address")]
        [MaxLength(240)]
        [Required]  
        public string Address { get; set; } = string.Empty;
        [Column("phone_number")]
        [MaxLength(13)]
        public string PhoneNumber { get; set; } = string.Empty;
        [Column("email")]
        [MaxLength(240)]
        public string Email { get; set; } = string.Empty;
        [Column("id_organization")]
        [Required]
        public long IdOrganization { get; set; }
        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        // Llave foranea 
        [ForeignKey(nameof(IdOrganization))]
        public virtual OrganizationEntity Organizations { get; set; } = null!;

        public virtual ICollection<UserEntity> Users { get; set; } = new List<UserEntity>();

        public virtual ICollection<AreaEntity> Areas { get; set; } = new List<AreaEntity>();
    }
}
