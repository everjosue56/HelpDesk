using DocumentFormat.OpenXml.Drawing.Charts;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("supplier_meeting")]
    public class SupplierMeetingEntity : BaseEntity
    {
        [Column("id_supplier")]
        [Required]
        public long IdSupplier {  get; set; }

        [Column("description")]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Column("reason_work")]
        [MaxLength(500)]
        [Required]
        public string ReasonWork { get; set; } = string.Empty;
        
        [Column("evidence")]
        [Required]
        [MaxLength]
        public string Evidence { get; set; } = string.Empty;

        [Column("meeting_date")]
        [Required]
        public DateTime MeetingDate { get; set; }

        // Propiedades Virtuales //


        [ForeignKey(nameof(IdSupplier))]
        public virtual SupplierEntity Supplier { get; set; } = null!;
    }
}
