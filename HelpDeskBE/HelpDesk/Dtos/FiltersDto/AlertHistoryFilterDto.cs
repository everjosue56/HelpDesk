using HelpDesk.Dtos.Common;
using System;

namespace HelpDesk.Dtos.FiltersDto
{
    public class AlertHistoryFilterDto : PaginationDto
    {
        // Filtrar por Id
        public long? IdAlertConfiguration { get; set; }
        public long? IdUser { get; set; }

        // Filtros por rango de fechas (Para buscar un día o mes específico)
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
