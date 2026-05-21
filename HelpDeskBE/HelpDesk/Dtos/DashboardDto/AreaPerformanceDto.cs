namespace HelpDesk.Dtos.DashboardDto
{
    public class AreaPerformanceDto
    {
        public string AreaNombre { get; set; } = string.Empty;
        public int CantidadTickets { get; set; }
        public double PorcentajeDelTotal { get; set; }
    }
}
