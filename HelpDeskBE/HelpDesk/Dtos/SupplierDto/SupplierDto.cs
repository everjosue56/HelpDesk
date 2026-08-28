using System;

namespace HelpDesk.Dtos.SupplierDto
{
    public class SupplierDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public string Address { get; set; } = string.Empty;
        public bool Compliance { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; } 
        public DateTime UpdatedTime { get; set; }

        // Datos de Organizacion 
        public long IdOrganization { get; set; }
        public string OrganizationName { get; set; } = string.Empty;
    }
}
