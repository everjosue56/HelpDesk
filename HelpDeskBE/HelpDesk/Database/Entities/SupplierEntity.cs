using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("supplier")]
    public class SupplierEntity : BaseEntity
    {
        [Column("id_organization")]
        [Required]
        public long IdOrganization { get; set; }
        [Column("name")]
        [Required]
        [MaxLength(60)]
        public string Name { get; set; } = string.Empty;
        [Column("description")]
        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Column("contac")]
        [Required]
        [MaxLength(60)]
        public string Contact { get; set; } = string.Empty;

        [Column("email")]
        [MaxLength(240)]
        public string Email { get; set; } = string.Empty;

        [Column("phone")]
        [MaxLength(13)]
        public string Phone { get; set; } = string.Empty;

        [Column("registration_date")]
        [Required]
        public DateTime RegistrationDate { get; set; }

        [Column("address")]
        [MaxLength(240)]
        public string Address { get; set; } = string.Empty;

        [Column("compliance")]
        [Required]
        public bool Compliance {  get; set; }

        [Column("is_active")]
        [Required]
        public bool IsActive { get; set; }

        // Propiedades virtuales // 

        [ForeignKey(nameof(IdOrganization))]
        public virtual OrganizationEntity Organization { get; set; } = null!;

    }
}
