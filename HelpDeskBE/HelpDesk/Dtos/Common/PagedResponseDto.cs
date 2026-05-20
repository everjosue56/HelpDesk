using System.Collections.Generic;

namespace HelpDesk.Dtos.Common
{
    public class PagedResponseDto<T>
    {
        public bool Status { get; set; } = true;
        public int StatusCode { get; set; } = 200;
        public string Message { get; set; } = string.Empty;
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public bool HasPreviousPage => CurrentPage > 1;
        public bool HasNextPage => CurrentPage < TotalPages;
    }
}
