using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class OrganizationFilterDto : PaginationDto
    {
        public string? Name { get; set; }
    }
}
