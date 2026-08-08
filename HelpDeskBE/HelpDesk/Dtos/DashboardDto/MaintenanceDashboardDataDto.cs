using System.Collections.Generic;

namespace HelpDesk.Dtos.DashboardDto
{
    public class MaintenanceDashboardDataDto
    {
        public int TotalProgramados { get; set; }
        public int TotalRealizados { get; set; }
        public int TotalVencidos { get; set; }
        public double TiempoTotalEjecucion { get; set; }

        public List<MaintenanceStatusDto> PorEstado { get; set; } = new();
        public List<MaintenanceFrequencyChartDto> PorFrecuencia { get; set; } = new();
        public List<MaintenanceAreaChartDto> PorArea { get; set; } = new();
        public List<MaintenanceMonthlyHistoryDto> HistorialMensual { get; set; } = new();
    }

}

