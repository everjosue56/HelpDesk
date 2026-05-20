using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class PriorityFilterDto : PaginationDto
    {
        public string? Name { get; set; }
    }
}
