using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml;

namespace HelpDesk.Database.Entities
{
    [Table("user")]
    public class UserEntity : BaseEntity
    {
        [Column("first_name")]
        [Required]
        [MaxLength(60)]
        public string FirstName { get; set; } = string.Empty;
        [Column("last_name")]
        [Required]
        [MaxLength(60)]
        public string LastName { get; set; } = string.Empty;
        [Column("user_name")]
        [Required]
        [MaxLength(60)]
        public string UserName { get; set; } = string.Empty;
        [Column("email")]
        [Required]
        [MaxLength(240)]
        public string Email { get; set; } = string.Empty;
        [Column("password_hash")]
        [Required]
        public byte[] PasswordHash { get; set; } = new byte[32];
        [Column("password_salt")]
        [Required]
        public byte[] PasswordSalt { get; set; } = new byte[32];
        [Column("phone_number")]
        [MaxLength(13)]
        public string PhoneNumber { get; set; } = string.Empty;
        [Column("id_rol")]
        [Required]
        public long IdRol { get; set; }
        [Column("is_active")]
        [Required]
        public bool IsActive { get; set; }
        [Column("id_agency")]
        [Required]
        public long IdAgency { get; set; }

        [Column("refresh_token")]
        public string RefreshToken { get; set; } = string.Empty;

        [Column("token_created")]
        public DateTime TokenCreated { get; set; }

        [Column("token_expires")]
        public DateTime TokenExpires { get; set; }

        [Column("id_area")]
        public long IdArea { get; set; }

        [ForeignKey(nameof(IdArea))]
        public virtual AreaEntity Area { get; set; } = null!;
        // Llaves Foraneas 
        [ForeignKey(nameof(IdAgency))]
        public virtual AgencyEntity Agency { get; set; } = null!;

        [ForeignKey(nameof(IdRol))]
        public virtual RolEntity Roles { get; set; } = null!;
    }
}
