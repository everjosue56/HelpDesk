using System;

namespace HelpDesk.Dtos.MaintenanceDto
{
    public class MaintenanceDto
    {
        public long Id { get; set; }
        public string Details { get; set; } = string.Empty;
        public DateTime NotificationDate { get; set; }
        public DateTime CompletionDate { get; set; }
        public decimal ExecutionTime { get; set; }
        public DateTime CreatedDate { get; set; }

        // --- Información del Tipo de Mantenimiento ---
        public long IdMaintenanceType { get; set; }
        public string MaintenanceTypeName { get; set; } = string.Empty;

        // --- Información del Área ---
        public long IdArea { get; set; }
        public string AreaName { get; set; } = string.Empty;

        // --- Información del Dispositivo ---
        public long IdDevice { get; set; }
        public string DeviceCode { get; set; } = string.Empty;
        public string DeviceBrand { get; set; } = string.Empty;

        // Propiedad calculada para mostrar en la lista
        public string DeviceFullDescription => $"{DeviceBrand} ({DeviceCode})";
    }
}
