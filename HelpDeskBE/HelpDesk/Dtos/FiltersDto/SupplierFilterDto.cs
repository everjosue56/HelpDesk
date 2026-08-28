using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class SupplierFilterDto : PaginationDto
    {
        public string Name { get; set; }  = string.Empty; 
        public string Contact {  get; set; }  = string.Empty;
    }
}
