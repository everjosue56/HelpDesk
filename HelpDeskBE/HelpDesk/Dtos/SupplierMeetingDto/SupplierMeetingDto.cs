using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace HelpDesk.Dtos.SupplierMeetingDto
{
    public class SupplierMeetingDto
    {
        public long Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ReasonWork { get; set; } = string.Empty;
        public string Evidence { get; set; } = string.Empty;
        public DateTime MeetingDate { get; set; } 
        public long IdSupplier {  get; set; }
        public DateTime CreatedDate { get; set; }

    } 
}
