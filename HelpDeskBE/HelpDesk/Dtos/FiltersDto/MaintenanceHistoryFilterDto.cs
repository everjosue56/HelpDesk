using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class MaintenanceHistoryFilterDto : PaginationDto
    {
        public long? IdMaintenance { get; set; }
        public long? IdDevice { get; set; }
        public long? IdUser { get; set; }
        public long? IdTypeDevice { get; set; }
    }
}
