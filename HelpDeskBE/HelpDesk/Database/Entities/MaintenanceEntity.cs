using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("maintenance")]
    public class MaintenanceEntity : BaseEntity
    {
        [Column("id_maintenance_type")]
        [Required]
        public long IdMaintenanceType { get; set; }
        [Column("id_area")]
        [Required]
        public long IdArea { get; set; }
        [Column("completion_date")]
        public DateTime CompletionDate { get; set; }
        [Column("notification_date")]
        public DateTime NotificationDate { get; set; }
        [Column("id_device")]
        [Required]
        public long IdDevice {  get; set; }
        [Column("details")]
        public string Details { get; set; } = string.Empty;
        [Column("execution_time")] 
        public decimal ExecutionTime { get; set; }

        // --- Propiedades de Navegación ---

        [ForeignKey(nameof(IdMaintenanceType))]
        public virtual TypeMaintenanceEntity TypeMaintenance { get; set; } = null!;

        [ForeignKey(nameof(IdArea))]
        public virtual AreaEntity Area { get; set; } = null!;

        [ForeignKey(nameof(IdDevice))]
        public virtual DeviceEntity Device { get; set; } = null!;
    }

}
