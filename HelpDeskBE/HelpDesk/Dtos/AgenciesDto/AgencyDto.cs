using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Dtos.AgenciesDto
{
    public class AgencyDto
    {
        public long Id { get; set; }    
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty; 
        public string Email { get; set; } = string.Empty;
        public long IdOrganization { get; set; }
        public bool IsActive { get; set; } = true;
        public string OrganizationName { get; set; } = string.Empty;
        public long OrganizationId { get; set; }
        public DateTime CreatedDate { get; set; }
    } 
}
