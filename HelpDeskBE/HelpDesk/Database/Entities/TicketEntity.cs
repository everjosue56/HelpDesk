using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("ticket")]
    public class TicketEntity : BaseEntity
    {
        [Column("report_date")]
        [Required]
        public DateTime ReportDate { get; set; }

        [Column("description")]
        [Required]
        [MaxLength(360)]
        public string Description { get; set; } = string.Empty;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        // --- Foreign Keys ---

        [Column("user_id")]
        [Required]
        public long IdUser { get; set; }

        [Column("type_error_id")]
        [Required]
        public long IdTypeError { get; set; }

        [Column("area_id")]
        [Required]
        public long IdArea { get; set; }

        [Column("software_system_id")]
        [Required]
        public long IdSoftwareSystem { get; set; }

        [Column("impact_id")]
        [Required]
        public long IdImpact { get; set; }

        [Column("priority_id")]
        [Required]
        public long IdPriority { get; set; }

        [Column("id_solution_state")]
        [Required]
        public long IdSolutionState { get; set; } = 3;

        [Column("user_assigned_id")]
        public long? IdUserAssigned { get; set; }

        // --- Virtual Properties (Navigation) ---

        [ForeignKey(nameof(IdUser))]
        public virtual UserEntity User { get; set; } = null!;

        [ForeignKey(nameof(IdTypeError))]
        public virtual TypeErrorEntity TypeError { get; set; } = null!;

        [ForeignKey(nameof(IdArea))]
        public virtual AreaEntity Area { get; set; } = null!;

        [ForeignKey(nameof(IdSoftwareSystem))]
        public virtual SoftwareSystemEntity SoftwareSystem { get; set; } = null!;

        [ForeignKey(nameof(IdImpact))]
        public virtual ImpactEntity Impact { get; set; } = null!;

        [ForeignKey(nameof(IdPriority))]
        public virtual PriorityEntity Priority { get; set; } = null!;
        
        [ForeignKey(nameof(IdSolutionState))]
        public virtual SolutionStatusEntity SolutionStatus { get; set; }

        [ForeignKey(nameof(IdUserAssigned))]
        public virtual UserEntity? AssignedUser { get; set; }
    }
}