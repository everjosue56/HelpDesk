using HelpDesk.Dtos.Common;
using System;

namespace HelpDesk.Dtos.FiltersDto
{
    public class NotificationHistoryFilterDto : PaginationDto
    {
        //  Filtro por la notificación específica
        public long? IdNotification { get; set; }

        //  Rango de fechas para auditar las acciones
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
