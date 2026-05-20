using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class ImpactFilterDto : PaginationDto
    {
        // Filtro para buscar impacto por nombre 
        public string? Name { get; set; }
    }
}
