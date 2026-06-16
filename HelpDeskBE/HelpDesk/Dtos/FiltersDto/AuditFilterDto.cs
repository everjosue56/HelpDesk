namespace HelpDesk.Dtos.FiltersDto
{
    public class AuditFilterDto
    {
        public string Keyword { get; set; } = string.Empty;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
