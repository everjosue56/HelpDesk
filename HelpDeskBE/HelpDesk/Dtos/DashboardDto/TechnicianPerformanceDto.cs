namespace HelpDesk.Dtos.DashboardDto
{
    public class TechnicianPerformanceDto
    {
        public string TecnicoNombre { get; set; } = string.Empty;
        public int TicketsResueltos { get; set; }
        public decimal MTTRHoras { get; set; }
    }
}
