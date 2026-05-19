using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("device")]
    public class DeviceEntity : BaseEntity
    {
        [Column("quantity")]
        public int Quantity { get; set; }
        [Column("brand_name")]
        public string BrandName { get; set; } = string.Empty;
        [Column("code")]
        public string Code { get; set; } = string.Empty;
        [Column("id_device_type")]
        [Required]
        public long IdDeviceType { get; set; }
        [Column("id_user")]
        [Required]
        public long IdUser {  get; set; }
        [Column("id_area")]
        [Required]
        public long IdArea { get; set; }
        [Column("observation")]
        public string Observation { get; set; } = string.Empty;
        [Column("is_active")]
        public bool IsActive { get; set; }

        // LLaves Foraneas 
        [ForeignKey(nameof(IdDeviceType))]
        public virtual TypeDeviceEntity TypeDevices { get; set; } = null!;

        [ForeignKey(nameof(IdUser))]
        public virtual UserEntity Users { get; set; } = null!;

        [ForeignKey(nameof(IdArea))]
        public virtual AreaEntity Areas { get; set; } = null!;
    }
}
