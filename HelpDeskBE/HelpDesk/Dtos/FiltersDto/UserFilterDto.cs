using HelpDesk.Dtos.Common;

namespace HelpDesk.Dtos.FiltersDto
{
    public class UserFilterDto : PaginationDto
    {
        public long? IdRol { get; set; }
        public long? IdAgency { get; set; }
        public long? IdArea { get; set; }

        // Búsqueda de texto abierta (Nombre, Apellido, UserName o Email)
        public string? Keyword { get; set; }
    }
}
