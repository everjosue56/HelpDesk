using HelpDesk.Dtos.Common;
using System;

namespace HelpDesk.Dtos.FiltersDto
{
    public class TicketHistoryFilterDto : PaginationDto
    {
        // Filtros relacionales de auditoría
        public long? IdTicket { get; set; }
        public long? IdResolution { get; set; }
        public long? IdUser { get; set; }

        // Filtro por rango de fechas de cierre
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
