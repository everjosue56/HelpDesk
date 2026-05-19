using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("resolution")]
    public class ResolutionEntity : BaseEntity
    {
        [Column("ticket_id")]
        [Required]
        public long IdTicket { get; set; }

        [Column("priority_id")]
        [Required]
        public long IdPriority { get; set; }

        [Column("action_taken")]
        [Required]
        [MaxLength(500)]
        public string ActionTaken { get; set; } = string.Empty;

        [Column("solution_status_id")]
        [Required]
        public long IdSolutionStatus { get; set; }

        [Column("resolution_date")]
        [Required]
        public DateTime ResolutionDate { get; set; }

        [Column("root_cause")]
        [Required]
        [MaxLength(500)]
        public string RootCause { get; set; } = string.Empty;

        [Column("preventive_measures")]
        [MaxLength(500)]
        public string PreventiveMeasures { get; set; } = string.Empty;

        [Column("observation")]
        [MaxLength(500)]
        public string Observation { get; set; } = string.Empty;

        [Column("second_observation")]
        [MaxLength(500)]
        public string SecondObservation { get; set; } = string.Empty;

        [Column("user_id")]
        [Required]
        public long IdUser { get; set; }

        [Column("device_id")]
        [Required]
        public long IdDevice { get; set; } 

        [Column("solution_time")]
        public decimal SolutionTime { get; set; }

        // --- Propiedades Virtuales (Navegación) ---

        [ForeignKey(nameof(IdTicket))]
        public virtual TicketEntity Ticket { get; set; } = null!;

        [ForeignKey(nameof(IdPriority))]
        public virtual PriorityEntity Priority { get; set; } = null!;

        [ForeignKey(nameof(IdSolutionStatus))]
        public virtual SolutionStatusEntity SolutionStatus { get; set; } = null!;

        [ForeignKey(nameof(IdUser))]
        public virtual UserEntity User { get; set; } = null!;

        [ForeignKey(nameof(IdDevice))]
        public virtual DeviceEntity Device { get; set; } = null!;
    }
}