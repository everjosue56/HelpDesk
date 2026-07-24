using ClosedXML.Excel;
using HelpDesk.Database;
using HelpDesk.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.Implementations
{
    public class MaintenanceExportService : IMaintenanceExportService
    {
        private readonly ApplicationDbContext _context;

        public MaintenanceExportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> ExportMaintenancesToExcelAsync(int year, int? month)
        {
 
            var query = _context.Maintenances
                .IgnoreQueryFilters()
                .Include(m => m.Device)
                .Include(m => m.Area)
                .Include(m => m.MaintenanceFrequencies)  
                .Where(m => !m.IsDeleted);
 
            if (year > 0)
            {
                query = query.Where(m => m.NotificationDate.Year == year || m.CompletionDate.Year == year);
            }

            if (month.HasValue && month.Value > 0)
            {
                query = query.Where(m => m.NotificationDate.Month == month.Value || m.CompletionDate.Month == month.Value);
            }

            var maintenances = await query.ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Mantenimientos Preventivos");

            // Cabecera estilizada
            worksheet.Cell(1, 1).Value = "ID";
            worksheet.Cell(1, 2).Value = "Equipo / Dispositivo";
            worksheet.Cell(1, 3).Value = "Área Operativa";
            worksheet.Cell(1, 4).Value = "Frecuencia";
            worksheet.Cell(1, 5).Value = "Último Mantenimiento / Fecha";
            worksheet.Cell(1, 6).Value = "Tiempo Estimado (Min)";
            worksheet.Cell(1, 7).Value = "Detalles / Observaciones";
            worksheet.Cell(1, 8).Value = "Fecha de Registro";

            var headerRow = worksheet.Row(1);
            headerRow.Style.Font.Bold = true;
            headerRow.Style.Fill.BackgroundColor = XLColor.FromHtml("#1A558B");
            headerRow.Style.Font.FontColor = XLColor.White;

            // Datos
            int row = 2;
            foreach (var m in maintenances)
            {
 
                string fechaMantenimiento = m.CompletionDate != DateTime.MinValue && m.CompletionDate.Year > 2000
                    ? m.CompletionDate.ToString("dd/MM/yyyy")
                    : m.NotificationDate.ToString("dd/MM/yyyy");

                worksheet.Cell(row, 1).Value = m.Id;
                worksheet.Cell(row, 2).Value = m.Device?.BrandName ?? "N/A";
                worksheet.Cell(row, 3).Value = m.Area?.NameArea ?? "N/A";
                worksheet.Cell(row, 4).Value = m.MaintenanceFrequencies?.Name ?? "N/A";
                worksheet.Cell(row, 5).Value = fechaMantenimiento;
                worksheet.Cell(row, 6).Value = m.ExecutionTime;
                worksheet.Cell(row, 7).Value = !string.IsNullOrWhiteSpace(m.Details) ? m.Details : "Sin observaciones";
                worksheet.Cell(row, 8).Value = m.CreatedDate.ToString("dd/MM/yyyy HH:mm");
                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}