using System;

namespace HelpDesk.Dtos.MaintenanceDto
{
    public class MaintenanceCalendarDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;  
        public DateTime Start { get; set; }            
        public DateTime End { get; set; }                
        public string Details { get; set; } = string.Empty;
        public string DeviceName { get; set; } = string.Empty;
        public string FrequencyName { get; set; } = string.Empty;
        public string Status { get; set; } = "Normal";  
        public string Color { get; set; } = "blue";    
    }
}
