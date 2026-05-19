using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    [Table("ticket_history")]
    public class TicketHistoryEntity : BaseEntity
    {
        [Column("id_report")]
        [Required]
        public long IdTicket { get; set; }
        [Column("id_resolution")]
        [Required]
        public long IdResolution { get; set; }
        [Column("id_user")]
        [Required]
        public long IdUser { get; set; }
        [Column("close_date")]
        [Required]
        public DateTime CloseDate { get; set; }

        // Llaves Foraneas 

        [ForeignKey(nameof(IdTicket))]
        public virtual TicketEntity Ticket { get; set; } = null!;

        [ForeignKey(nameof(IdResolution))]
        public virtual ResolutionEntity Resolution { get; set; } = null!;

        [ForeignKey(nameof(IdUser))]
        public virtual UserEntity User { get; set; } = null!;
    }
}
