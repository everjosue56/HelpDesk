using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class AgencyFilterDto : PaginationDto
    {
        // filtro para buscar agencias por nombre 
        public string? Name { get; set; } 
    }
}
