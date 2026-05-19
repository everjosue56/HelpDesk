using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Dtos.DeviceDto
{
    public class CreateDeviceDto
    {
        public int Quantity { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public long IdDeviceType { get; set; }
        public long IdUser { get; set; }
        public long IdArea { get; set; }
        public string Observation { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
