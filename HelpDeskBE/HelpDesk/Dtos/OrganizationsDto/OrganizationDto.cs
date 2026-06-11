using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Dtos.OrganizationsDto
{
    public class OrganizationDto
    {

        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Logo { get; set; }  
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Description { get; set; }  
        public string Address { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }
}
