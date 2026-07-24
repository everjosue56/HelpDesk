using ClosedXML.Excel;
using HelpDesk.Database;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.TicketExportService
{
    public class TicketExportService : ITicketExportService
    {
        private readonly ApplicationDbContext _context;

        public TicketExportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> ExportTicketToExcelAsync() 
        {
            var tickets = await _context.Tickets
                .Include(t => t.Area)
                .Include(t => t.User)
                .Include(t => t.SoftwareSystem)
                .Include(t => t.Priority)
                .Include(t => t.TypeError)
                .Include(t => t.Impact)
                .ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Tickets");

            // Cabecera institucional
            worksheet.Cell(1, 1).Value = "SISTEMA HELPDESK - SOPORTE A USUARIOS";
            worksheet.Range("A1:J1").Merge().Style.Font.SetBold().Font.FontColor = XLColor.White;
            worksheet.Range("A1:J1").Style.Fill.BackgroundColor = XLColor.FromHtml("#1a558b");

            worksheet.Cell(3, 1).Value = "ID";
            worksheet.Cell(3, 2).Value = "Area / Departamento";
            worksheet.Cell(3, 3).Value = "Software Afectado";
            worksheet.Cell(3, 4).Value = "Tipo de Error";
            worksheet.Cell(3, 5).Value = "Nivel de Prioridad";
            worksheet.Cell(3, 6).Value = "Impacto";
            worksheet.Cell(3, 7).Value = "Usuario";
            worksheet.Cell(3, 8).Value = "Detalles de Ticket";
            worksheet.Cell(3, 9).Value = "Estado";
            worksheet.Cell(3, 10).Value = "Fecha de Creacion";

            var headerRange = worksheet.Range("A3:J3");
            headerRange.Style.Font.SetBold().Fill.BackgroundColor = XLColor.LightGray;

            int row = 4;
            foreach (var ticket in tickets)
            {

                worksheet.Cell(row, 1).Value = ticket.Id;
                worksheet.Cell(row, 2).Value = ticket.Area?.NameArea ?? "N/A";
                worksheet.Cell(row, 3).Value = ticket.SoftwareSystem?.Name?? "N/A";
                worksheet.Cell(row, 4).Value = ticket.TypeError?.Name ?? "N/A";
                worksheet.Cell(row, 5).Value = ticket.Priority?.Name ?? "N/A";
                worksheet.Cell(row, 6).Value = ticket.Impact?.Name ?? "N/A";
                worksheet.Cell(row, 7).Value = ticket.User?.UserName ?? "N/A";
                worksheet.Cell(row, 8).Value = ticket.Description;
                worksheet.Cell(row, 9).Value = ticket.IsActive;
                worksheet.Cell(row, 10).Value = ticket.CreatedDate;

                row++;


            }

            // Autoajustar columnas
            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();

        }

    }
}
