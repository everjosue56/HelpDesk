using System;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.MaintenanceDto
{
    public class RenewMaintenanceDto
    {
        [Required]
        public DateTime NotificationDate { get; set; }

        [Required]
        public DateTime CompletionDate { get; set; }

        [Required]
        public string Details { get; set; } = string.Empty;

        [Required]
        public decimal ExecutionTime { get; set; }
    }
}
