using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("organization")]
    public class OrganizationEntity : BaseEntity
    {
        [Column("name")]
        [Required]
        [MaxLength(60)]

        public string Name { get; set; } = string.Empty;

        [Column("logo")]
        [MaxLength(240)]
        public string Logo { get; set; } = string.Empty;

        [Column("phone_number")]
        [MaxLength(13)]
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Column("description")]
        [MaxLength(240)]
        public string Description { get; set; } = string.Empty;

        [Column("address")]
        [MaxLength(240)]
        [Required]
        public string Address { get; set; } = string.Empty;

        // En OrganizationEntity.cs
        public virtual ICollection<AgencyEntity> Agencies { get; set; } = new List<AgencyEntity>();
    }
}
