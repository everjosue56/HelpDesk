using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class AlertConfigurationFilterDto : PaginationDto
    {
        // Busca coincidencias en Título, Asunto o Descripción 
        public string? SearchTerm { get; set; }

        public bool? IsActive { get; set; }
        public bool? IsGlobal { get; set; }
    }
}
