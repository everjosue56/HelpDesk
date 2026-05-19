using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("notification_history")]
    public class NotificationHistoryEntity : BaseEntity
    {
        [Column("id_notification")]
        [Required]
        public long IdNotification { get; set; }
        [Column("action_date")]
        [Required]
        public DateTime ActionDate { get; set; }
        [Column("id_reference")]
        [Required]
 
        // llaves foraneas 

        [ForeignKey(nameof(IdNotification))]
        public virtual NotificationEntity Notifications { get; set; } = null!;
    }
}
