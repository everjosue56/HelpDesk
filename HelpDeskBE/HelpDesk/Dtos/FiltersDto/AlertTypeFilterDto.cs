using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class AlertTypeFilterDto : PaginationDto
    {
        // Filtro por nombre de tipo de alerta
        public string? Name { get; set; }
    }
}
