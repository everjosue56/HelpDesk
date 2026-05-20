using HelpDesk.Dtos.Common;
using System;

namespace HelpDesk.Dtos.FiltersDto
{
    public class ResolutionFilterDto : PaginationDto
    {
        // Filtros relacionales estructurales
        public long? IdTicket { get; set; }
        public long? IdUser { get; set; }
        public long? IdSolutionStatus { get; set; } 
        public long? IdDevice { get; set; }      
        public long? IdPriority { get; set; }

        // Filtro por rango de fechas en las que se cerró el caso
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        // Búsqueda de palabras clave en campos de texto extensos (Descripción / Diagnóstico)
        public string? Keyword { get; set; }
    }
}
