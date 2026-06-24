using System;

namespace HelpDesk.Dtos.MaintenanceHistoryDto
{
    public class MaintenanceHistoryDto
    {
        public long Id { get; set; }
        public decimal SolutionTime { get; set; }
        public DateTime CreatedDate { get; set; } 

        // --- Datos Foráneos de Mantenimiento ---
        public long IdMaintenance { get; set; }
        public string MaintenanceDetails { get; set; } = string.Empty;

        // --- Datos Foráneos del Dispositivo (Device) ---
        public long IdDevice { get; set; }
        public string DeviceCode { get; set; } = string.Empty;
        public string DeviceBrand { get; set; } = string.Empty;
        public string DeviceType { get; set; } = string.Empty; 

        // --- Datos Foráneos del Técnico / Usuario responsable ---
        public long IdUser { get; set; }
        public string TechnicalName { get; set; } = string.Empty;
        public string TechnicalEmail { get; set; } = string.Empty;

        // --- Datos de tipo de mantenimiento ---
        public string TypeMaintenanceName { get; set; } = string.Empty;

    }
}
