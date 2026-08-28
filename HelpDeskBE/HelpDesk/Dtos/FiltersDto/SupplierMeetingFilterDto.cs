using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class SupplierMeetingFilterDto : PaginationDto
    {
        public string Description { get; set; } = string.Empty;
    }
}
