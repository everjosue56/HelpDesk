using System;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Models
{
    public class AuditLog
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty; 

        [Required]
        [MaxLength(100)]
        public string TableName { get; set; } = string.Empty; 

        [Required]
        public string Description { get; set; } = string.Empty; 

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}