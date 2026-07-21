using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    public class MaintenanceFrequencyEntity : BaseEntity
    {
        [Column("name")]
        [MaxLength(60)]
        [Required]
        public string Name { get; set; } = string.Empty;

        [Column("days_interval")]
        [Required]
        public int DaysInterval { get; set; }
    }
}
    