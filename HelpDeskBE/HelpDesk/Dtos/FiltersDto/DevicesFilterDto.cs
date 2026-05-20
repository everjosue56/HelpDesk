using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class DevicesFilterDto : PaginationDto
    {
        public long? IdUser { get; set; }
        public long? IdArea { get; set; }
        public long? IdDeviceType { get; set; } 
        // Filtrar por codigo o marca del dispositivo 
        public string? SearchTerm { get; set; }
    }
}
