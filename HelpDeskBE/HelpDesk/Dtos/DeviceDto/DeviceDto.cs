using System;

namespace HelpDesk.Dtos.DeviceDto
{
    public class DeviceDto
    {
        public long Id { get; set; }
        public int Quantity { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Observation { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }

        // --- Información del Tipo de Dispositivo ---
        public long IdDeviceType { get; set; }  
        public string DeviceTypeName { get; set; } = string.Empty;

        // --- Información del Usuario Responsable ---
        public long IdUser { get; set; }
        public string UserName { get; set; } = string.Empty;

        // --- Información del Área Física ---
        public long IdArea { get; set; }
        public string AreaName { get; set; } = string.Empty;

        // Campo calculado opcional para mostrar en combos o títulos
        public string FullDescription => $"{BrandName} - {Code}";
    }
}
