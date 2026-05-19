using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("alert_history")]
    public class AlertHistoryEntity : BaseEntity
    {
        [Column("id_alert_configuration")]
        [Required]
        public long IdAlertConfiguration {  get; set; }
        [Column("id_user")]
        [Required]
        public long IdUser {  get; set; }
        [Column("action_date")]
        [Required]
        public DateTime ActionDate { get; set; }

        // Llaves Foraneas 

        [ForeignKey(nameof(IdAlertConfiguration))]
        public virtual AlertConfigurationEntity AlertConfiguration { get; set; } = null!;

        [ForeignKey(nameof(IdUser))]
        public virtual UserEntity User { get; set; } = null!;
    }
}
