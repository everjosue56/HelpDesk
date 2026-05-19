using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("maintenance_history")]
    public class MaintenanceHistoryEntity : BaseEntity
    {
        [Column("id_maintenance")]
        [Required]
        public long IdMaintenance { get; set; }
        [Column("id_device")]
        [Required]
        public long IdDevice { get; set; }
        [Column("id_user")]
        [Required]
        public long IdUser { get; set; }
        [Column("solution_time")]
        [Required]
        public decimal SolutionTime { get; set; }
        [Column("id_type_device")]
        [Required]
        public long IdTypeDevice { get; set; }

        // Llaves Foraneas 
        [ForeignKey(nameof(IdMaintenance))]
        public virtual MaintenanceEntity Maintenances { get; set; } = null!;
        [ForeignKey(nameof(IdDevice))]
        public virtual DeviceEntity Devices { get; set; } = null!;
        [ForeignKey(nameof(IdUser))]
        public virtual UserEntity Users { get; set; } = null!;
        [ForeignKey(nameof(IdTypeDevice))]
        public virtual TypeDeviceEntity DevicesType { get; set; } = null!;
    }
}
