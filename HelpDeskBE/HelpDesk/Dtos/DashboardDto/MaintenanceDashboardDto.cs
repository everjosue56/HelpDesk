using System.Collections.Generic;

namespace HelpDesk.Dtos.DashboardDto
{
    public class MaintenanceDashboardDto
    {
        public int TotalProgramados { get; set; }
        public int TotalRealizados { get; set; }
        public int TotalVencidos { get; set; }
        public decimal TiempoTotalEjecucion { get; set; }

        public List<MaintenanceStatusDto> PorEstado { get; set; } = new();
        public List<MaintenanceFrequencyChartDto> PorFrecuencia { get; set; } = new();
        public List<MaintenanceAreaChartDto> PorArea { get; set; } = new();
        public List<MaintenanceMonthlyHistoryDto> HistorialMensual { get; set; } = new();
    }

    public class MaintenanceStatusDto
    {
        public string Estado { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class MaintenanceFrequencyChartDto
    {
        public string Frecuencia { get; set; } = string.Empty;
        public int Cantidad { get; set; }
    }

    public class MaintenanceAreaChartDto
    {
        public string Area { get; set; } = string.Empty;
        public int Cantidad { get; set; }
    }

    public class MaintenanceMonthlyHistoryDto
    {
        public int MesNumero { get; set; }
        public string MesNombre { get; set; } = string.Empty;
        public int Cantidad { get; set; }
    }
}
