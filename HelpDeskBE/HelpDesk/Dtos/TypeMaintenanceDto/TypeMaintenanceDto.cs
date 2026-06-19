using System;

namespace HelpDesk.Dtos.TypeMaintenanceDto
{
    public class TypeMaintenanceDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int EstimatedTime { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
