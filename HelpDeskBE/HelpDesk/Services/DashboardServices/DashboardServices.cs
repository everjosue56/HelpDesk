using HelpDesk.Database;
using HelpDesk.Dtos.DashboardDto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.DashboardServices
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DashboardDto>> GetSlaReportAsync(int year)
        {
            // Si year viene en 0, asignamos el año actual
            if (year <= 0) year = DateTime.UtcNow.Year;

            var resolutions = await _context.Resolutions
                .IgnoreQueryFilters()
                .Where(r => r.ResolutionDate.Year == year)
                .ToListAsync();

   
            var tickets = await _context.Tickets
                .IgnoreQueryFilters()
                .Where(t => t.CreatedDate.Year == year)  
                .ToListAsync();

            var goalsDictionary = await _context.SlaGoals
                .Where(g => g.Year == year)
                .GroupBy(g => g.Month)
    .Select(g => g.OrderByDescending(x => x.UpdatedAt).First())
                .ToDictionaryAsync(g => g.Month, g => g.GoalValue);

            var report = new List<DashboardDto>();

            for (int m = 1; m <= 12; m++)
            {
          
                var ticketsDelMes = tickets.Where(t => t.CreatedDate.Month == m).ToList();
                var resolucionesDelMes = resolutions.Where(r => r.ResolutionDate.Month == m).ToList();

                int incidentesCount = ticketsDelMes.Count;

                decimal mttr = resolucionesDelMes.Any()
                    ? Math.Round(resolucionesDelMes.Average(r => r.SolutionTime), 2)
                    : 0;

                double metaAlcanzada = 0;

                if (incidentesCount > 0)
                {
                    var aTiempo = resolucionesDelMes.Count(r => r.SolutionTime <= 24);
                    metaAlcanzada = Math.Round((double)aTiempo / incidentesCount * 100, 2);
                }

                double metaFija = goalsDictionary.TryGetValue(m, out var customGoal) ? customGoal : 95.0;

                string estadoCumplimiento = "Sin Datos";

                if (incidentesCount > 0)
                {
                    estadoCumplimiento = metaAlcanzada >= metaFija ? "Cumplido" : "Alerta";
                }

                report.Add(new DashboardDto
                {
                    MesNumero = m,
                    MesNombre = CultureInfo.GetCultureInfo("es-ES").DateTimeFormat.GetMonthName(m),
                    Meta = metaFija,
                    MetaAlcanzada = metaAlcanzada,
                    IncidentesReportados = incidentesCount,
                    TiempoPromedioResolucion = mttr,
                    Cumplimiento = estadoCumplimiento
                });
            }

            return report;
        }

        // 1. KPI de Distribución por Agencia (Modificado con filtro de mes opcional)
        public async Task<List<AgencyLoadDto>> GetTicketsByAgencyAsync(int year, int? month)
        {
            var query = _context.Tickets
                .IgnoreQueryFilters()
                .Include(t => t.User).ThenInclude(u => u.Agency)
                .Where(t => t.ReportDate.Year == year);

            // Filtro de mes dinámico
            if (month.HasValue)
            {
                query = query.Where(t => t.ReportDate.Month == month.Value);
            }

            return await query
                .GroupBy(t => t.User.Agency.Name)
                .Select(g => new AgencyLoadDto
                {
                    AgenciaNombre = g.Key ?? "Oficina Central",
                    TotalTickets = g.Count(),
                    TicketsCriticos = g.Count(t => t.IdPriority == 4) 
                })
                .OrderByDescending(x => x.TotalTickets)
                .ToListAsync();
        }

        //  2. KPI de Carga por Área Operativa (Modificado con filtro de mes opcional)
        public async Task<List<AreaPerformanceDto>> GetTicketsByAreaAsync(int year, int? month, long? idAgency)
        {
            var totalQuery = _context.Tickets.AsNoTracking().IgnoreQueryFilters().Where(t => t.ReportDate.Year == year);

            var query = _context.Tickets.AsNoTracking()
                .IgnoreQueryFilters()
                .Include(t => t.User)
                    .ThenInclude(u => u.Area)
                .Where(t => t.ReportDate.Year == year);

            if (month.HasValue)
            {
                totalQuery = totalQuery.Where(t => t.ReportDate.Month == month.Value);
                query = query.Where(t => t.ReportDate.Month == month.Value);
            }

            if (idAgency.HasValue)
            {
                totalQuery = totalQuery.Where(t => t.User.Area.IdAgency == idAgency.Value);
                query = query.Where(t => t.User.Area.IdAgency == idAgency.Value);
            }

            var totalTicketsPeriodo = await totalQuery.CountAsync();
            if (totalTicketsPeriodo == 0) return new List<AreaPerformanceDto>();


            return await query
                .GroupBy(t => t.User.Area.NameArea)
                .Select(g => new AreaPerformanceDto
                {
                    AreaNombre = g.Key ?? "General",
                    CantidadTickets = g.Count(),
                    PorcentajeDelTotal = Math.Round((double)g.Count() / totalTicketsPeriodo * 100, 2)
                })
                .OrderByDescending(x => x.CantidadTickets)
                .ToListAsync();
        }

        //  3. KPI de Productividad de Técnicos 
        public async Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync(int year, int? month, long? userId)
        {
            // 1. Cargamos la base de las resoluciones con el usuario
            var query = _context.Resolutions
                .IgnoreQueryFilters()
                .Include(r => r.User)
                .Where(r => r.ResolutionDate.Year == year);

            query = query.Where(r => r.User.IdRol == 1 || r.User.IdRol == 2);

            if (month.HasValue)
            {
                query = query.Where(r => r.ResolutionDate.Month == month.Value);
            }

            if (userId.HasValue)
            {
                query = query.Where(r => r.IdUser == userId.Value);
            }

            return await query
                .GroupBy(r => new { r.User.FirstName, r.User.LastName })
                .Select(g => new TechnicianPerformanceDto
                {
                    TecnicoNombre = $"{g.Key.FirstName} {g.Key.LastName}",
                    TicketsResueltos = g.Count(),
                    MTTRHoras = Math.Round(g.Average(r => r.SolutionTime), 2)
                })
                .OrderByDescending(x => x.TicketsResueltos)
                .ToListAsync();
        }
    }
}