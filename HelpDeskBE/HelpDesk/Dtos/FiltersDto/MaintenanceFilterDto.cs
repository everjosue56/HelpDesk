using HelpDesk.Dtos.Common;
using System;

namespace HelpDesk.Dtos.FiltersDto
{
    public class MaintenanceFilterDto : PaginationDto
    {
        // Filtros relacionales estructurales
        public long? IdMaintenanceType { get; set; }
        public long? IdArea { get; set; }
        public long? IdDevice { get; set; }

        //  Filtro por rango de fechas de registro/notificación
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        // Búsqueda de palabras clave en el reporte técnico
        public string? Keyword { get; set; }
    }
}
