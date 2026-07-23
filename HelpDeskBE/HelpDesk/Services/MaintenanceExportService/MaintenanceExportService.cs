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
                .Where(m => !m.IsDeleted && m.CompletionDate.Year == year);

            if (month.HasValue && month.Value > 0)
            {
                query = query.Where(m => m.CompletionDate.Month == month.Value);
            }

            var maintenances = await query.ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Mantenimientos Preventivos");

            // Cabecera estilizada
            worksheet.Cell(1, 1).Value = "ID";
            worksheet.Cell(1, 2).Value = "Equipo / Dispositivo";
            worksheet.Cell(1, 3).Value = "Área Operativa";
            worksheet.Cell(1, 4).Value = "Frecuencia";
            worksheet.Cell(1, 5).Value = "Ultimo Mantenimiento";
            worksheet.Cell(1, 6).Value = "Tiempo Estimado (Mn)";
            worksheet.Cell(1, 7).Value = "Detalles / Observaciones";

            var headerRow = worksheet.Row(1);
            headerRow.Style.Font.Bold = true;
            headerRow.Style.Fill.BackgroundColor = XLColor.FromHtml("#1A558B"); 
            headerRow.Style.Font.FontColor = XLColor.White;

            // Datos
            int row = 2;
            foreach (var m in maintenances)
            {
                worksheet.Cell(row, 1).Value = m.Id;
                worksheet.Cell(row, 2).Value = m.Device?.BrandName ?? "N/A";
                worksheet.Cell(row, 3).Value = m.Area?.NameArea ?? "N/A";
                worksheet.Cell(row, 4).Value = m.MaintenanceFrequencies?.Name ?? "N/A";
                worksheet.Cell(row, 5).Value = m.CompletionDate.ToString("dd/MM/yyyy");
                worksheet.Cell(row, 6).Value = m.ExecutionTime;
                worksheet.Cell(row, 7).Value = m.Details ?? "";
                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}