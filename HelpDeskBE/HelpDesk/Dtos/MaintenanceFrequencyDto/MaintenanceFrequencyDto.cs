using System;

namespace HelpDesk.Dtos.MaintenanceFrequencyDto
{
    public class MaintenanceFrequencyDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DaysInterval { get; set; } 
        public DateTime CreatedDate { get; set; }

    }
}
