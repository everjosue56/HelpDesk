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

        // KPIS de reportes de metas y frecuencia de tickets por mes 
        public async Task<List<DashboardDto>> GetSlaReportAsync(int year)
        {
            // 1. Jalamos las resoluciones del año seleccionado
            var resolutions = await _context.Resolutions
                .Where(r => r.ResolutionDate.Year == year)
                .ToListAsync();

            // 2. Jalamos todos los tickets del año para contar incidencias
            var tickets = await _context.Tickets
                .Where(t => t.ReportDate.Year == year)
                .ToListAsync();

            var report = new List<DashboardDto>();

            // 3. Iteramos los 12 meses del año para armar la tabla idéntica a tu ejemplo
            for (int m = 1; m <= 12; m++)
            {
                var ticketsDelMes = tickets.Where(t => t.ReportDate.Month == m).ToList();
                var resolucionesDelMes = resolutions.Where(r => r.ResolutionDate.Month == m).ToList();

                int incidentesCount = ticketsDelMes.Count;

                // Calculamos el MTTR (Tiempo promedio de resolución)
                decimal mttr = resolucionesDelMes.Any()
                    ? Math.Round(resolucionesDelMes.Average(r => r.SolutionTime), 2)
                    : 0;

                // Calculamos el % de cumplimiento (Meta alcanzada)
                // Ejemplo: % de tickets resueltos en menos de 24 horas
                double metaAlcanzada = 0;
                if (resolucionesDelMes.Any())
                {
                    var aTiempo = resolucionesDelMes.Count(r => r.SolutionTime <= 24);
                    metaAlcanzada = Math.Round((double)aTiempo / resolucionesDelMes.Count * 100, 2);
                }

                double metaFija = 95.0; // La meta estipulada por la empresa
                string estadoCumplimiento = "Sin Datos";

                if (incidentesCount > 0)
                {
                    estadoCumplimiento = metaAlcanzada >= metaFija ? "Cumplido" : "Alerta";
                }

                report.Add(new DashboardDto
                {
                    MesNumero = m,
                    // Convierte el número del mes a nombre en español (enero, febrero...)
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

        // 1. KPI de Distribución por Agencia 
        public async Task<List<AgencyLoadDto>> GetTicketsByAgencyAsync(int year)
        {
            return await _context.Tickets
                .Include(t => t.User).ThenInclude(u => u.Agency)
                .Where(t => t.ReportDate.Year == year)
                .GroupBy(t => t.User.Agency.Name)
                .Select(g => new AgencyLoadDto
                {
                    AgenciaNombre = g.Key ?? "Oficina Central",
                    TotalTickets = g.Count(),
                    TicketsCriticos = g.Count(t => t.IdPriority == 3) 
                })
                .OrderByDescending(x => x.TotalTickets)
                .ToListAsync();
        }

        // 2. KPI de Carga por Área Operativa (Top de departamentos más problemáticos)
        public async Task<List<AreaPerformanceDto>> GetTicketsByAreaAsync(int year)
        {
            var totalTicketsAnual = await _context.Tickets.CountAsync(t => t.ReportDate.Year == year);
            if (totalTicketsAnual == 0) return new List<AreaPerformanceDto>();

            return await _context.Tickets
                .Include(t => t.User).ThenInclude(u => u.Area)
                .Where(t => t.ReportDate.Year == year)
                .GroupBy(t => t.User.Area.NameArea)
                .Select(g => new AreaPerformanceDto
                {
                    AreaNombre = g.Key ?? "General",
                    CantidadTickets = g.Count(),
                    PorcentajeDelTotal = Math.Round((double)g.Count() / totalTicketsAnual * 100, 2)
                })
                .OrderByDescending(x => x.CantidadTickets)
                .ToListAsync();
        }

        // 3. KPI de Productividad de Técnicos (Control interno de TI)
        public async Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync(int year)
        {
            return await _context.Resolutions
                .Include(r => r.User) // Técnico que resolvió
                .Where(r => r.ResolutionDate.Year == year)
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