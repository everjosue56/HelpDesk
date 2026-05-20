using HelpDesk.Dtos.Common;
using System;

namespace HelpDesk.Dtos.FiltersDto
{
    public class TicketFilterDto : PaginationDto
    {
        // Filtros relacionales (Todas tus llaves foráneas)
        public long? IdUser { get; set; }
        public long? IdTypeError { get; set; }
        public long? IdArea { get; set; }
        public long? IdSoftwareSystem { get; set; }
        public long? IdImpact { get; set; }
        public long? IdPriority { get; set; }

        // Filtro por rango de fechas de reporte
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        // Búsqueda abierta en la descripción del problema
        public string? Keyword { get; set; }
    }
}
