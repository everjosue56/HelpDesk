namespace HelpDesk.Dtos.DashboardDto
{
    public class DashboardDto
    {
        public int MesNumero { get; set; }
        public string MesNombre { get; set; } = string.Empty;
        public double Meta { get; set; }
        public double MetaAlcanzada { get; set; }
        public int IncidentesReportados { get; set; }
        public decimal TiempoPromedioResolucion { get; set; }
        public string Cumplimiento { get; set; } = string.Empty;
    }
}
