using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class NotificationFilterDto : PaginationDto
    {
        // Filtros relacionales estructurales
        public long? IdUser { get; set; }
        public long? IdAlertType { get; set; }

        // Filtro booleano para la campana de React (Leídas / No Leídas)
        public bool? IsRead { get; set; }

        // Búsqueda por texto dentro del mensaje
        public string? Keyword { get; set; }
    }
}
