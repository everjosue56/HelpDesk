using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class AreaFilterDto : PaginationDto
    {

        // Filtro de area por nombre 
        public string? SearchName { get; set; } 
    }
}
