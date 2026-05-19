using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("notification")]
    public class NotificationEntity : BaseEntity
    {
        [Column("id_user")]
        [Required]
        public long IdUser { get; set; }
        [Column("id_alert_type")]
        [Required]
        public long IdAlertType { get; set; }
        [Column("text_message")]
        [MaxLength(500)]
        [Required]
        public string TextMessage { get; set; } = string.Empty;
        [Column("sent_at")]
        public DateTime? SentAt { get; set; }
        [Column("is_read")]
        public bool IsRead { get; set; }
        [Column("id_reference")]
        [Required]
        public long IdReference { get; set; }

        // --- llaves foraneas ---

        [ForeignKey(nameof(IdUser))]
        public virtual UserEntity Users { get; set; } = null!;
        [ForeignKey(nameof(IdAlertType))]
        public virtual AlertTypeEntity AlertTypes { get; set; } = null!;
  
    }
}
