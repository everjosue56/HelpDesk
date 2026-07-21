using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class MaintenanceFrequencyFilterDto : PaginationDto
    {
        // Filtro por nombre
        public string? Name { get; set; }
    }
}
