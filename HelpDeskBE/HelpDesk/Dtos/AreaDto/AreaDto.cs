using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Dtos.AreaDto
{
    public class AreaDto
    {
        public long Id { get; set; }
        public string NameArea { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public long IdAgency { get; set; }

        public string AgencyName { get; set; }

    }
}
