namespace HelpDesk.Dtos.Common
{
    public class PaginationDto
    {
        private int _pageNumber = 1;
        private int _pageSize = 5;
        private const int MaxPageSize = 50; 

        public int PageNumber
        {
            get => _pageNumber;
            set => _pageNumber = (value < 1) ? 1 : value;
        }

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value < 1) ? 5 : (value > MaxPageSize) ? MaxPageSize : value;
        }

            
    }
}
