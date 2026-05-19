using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("alert_configuration")]
    public class AlertConfigurationEntity : BaseEntity
    {
        [Column("title")]
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Column("subject")]
        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty; 

        [Column("description")]
        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty; 

        [Column("is_global")]
        public bool IsGlobal { get; set; }

        [Column("area_id")]
        public long? IdArea { get; set; } 
        [Column("agency_id")]
        public long? IdAgency { get; set; } 

        [Column("scheduled_date")]
        public DateTime? ScheduledDate { get; set; }
        [Column("is_active")]
        public bool IsActive { get; set; }

        // --- Propiedades de Navegación ---

        [ForeignKey(nameof(IdArea))]
        public virtual AreaEntity? Areas { get; set; }

        [ForeignKey(nameof(IdAgency))]
        public virtual AgencyEntity? Agencys { get; set; }
    }
}