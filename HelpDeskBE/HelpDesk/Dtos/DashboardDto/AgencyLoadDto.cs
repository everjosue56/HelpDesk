namespace HelpDesk.Dtos.DashboardDto
{
    public class AgencyLoadDto
    {
        public string AgenciaNombre { get; set; } = string.Empty;
        public int TotalTickets { get; set; }
        public int TicketsCriticos { get; set; }
    }
}
