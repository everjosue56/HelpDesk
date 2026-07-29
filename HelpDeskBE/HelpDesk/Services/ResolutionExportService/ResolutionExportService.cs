using ClosedXML.Excel;
using DocumentFormat.OpenXml.Packaging;
using HelpDesk.Database;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;

namespace HelpDesk.Services.ResolutionExportService
{
    public class ResolutionExportService : IExportResolutionService
    {
        private readonly ApplicationDbContext _context;

        public ResolutionExportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> ExportResolutionToExcelAsync()
        {
            var resolutions = await _context.Resolutions
                .Include(r => r.User)
                .Include(r => r.Priority)
                .Include(r => r.Ticket)
                    .ThenInclude(ra => ra.User)
                .Include(r => r.Device)
                .ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Resoluciones");

            // Cabecera institucional
            worksheet.Cell(1, 1).Value = "SISTEMA HELPDESK - SOPORTE A USUARIOS";
            worksheet.Range("A1:O1").Merge().Style.Font.SetBold().Font.FontColor = XLColor.White;
            worksheet.Range("A1:O1").Style.Fill.BackgroundColor = XLColor.FromHtml("#1a558b");

            worksheet.Cell(3, 1).Value = "ID";
            worksheet.Cell(3, 2).Value = "Tecnico";
            worksheet.Cell(3, 3).Value = "Prioridad";
            worksheet.Cell(3, 4).Value = "Tiempo Invertido";
            worksheet.Cell(3, 5).Value = "Ticket";
            worksheet.Cell(3, 6).Value = "Dispositivo";
            worksheet.Cell(3, 7).Value = "Estado";
            worksheet.Cell(3, 8).Value = "Usuario Solicitante";
            worksheet.Cell(3, 9).Value = "Descripcion";
            worksheet.Cell(3, 10).Value = "Accion Tomada";
            worksheet.Cell(3, 11).Value = "Problema Raiz";
            worksheet.Cell(3, 12).Value = "Medida Preventiva";
            worksheet.Cell(3, 13).Value = "Observacion";
            worksheet.Cell(3, 14).Value = "Segunda Observacion";
            worksheet.Cell(3, 15).Value = "Fecha de Creacion";

            var headerRange = worksheet.Range("A3:O3");
            headerRange.Style.Font.SetBold().Fill.BackgroundColor = XLColor.LightGray;

            int row = 4;
            foreach (var resolution in resolutions)
            {
                worksheet.Cell(row, 1).Value = resolution.Id;
                worksheet.Cell(row, 2).Value = resolution.User.UserName;
                worksheet.Cell(row, 3).Value = resolution.Priority?.Name ?? "N/A";
                worksheet.Cell(row, 4).Value = resolution.SolutionTime;
                worksheet.Cell(row, 5).Value = resolution.Ticket?.Id;
                worksheet.Cell(row, 6).Value = resolution.Device?.BrandName ?? "N/A";
                worksheet.Cell(row, 7).Value = resolution.SolutionStatus?.Name ?? "N/A";
                worksheet.Cell(row, 8).Value = resolution.Ticket?.User.UserName;
                worksheet.Cell(row, 9).Value = resolution.Ticket?.Description ?? "N/A";
                worksheet.Cell(row, 10).Value = resolution.ActionTaken;
                worksheet.Cell(row, 11).Value = resolution.RootCause;
                worksheet.Cell(row, 12).Value = resolution.PreventiveMeasures;
                worksheet.Cell(row, 13).Value = resolution.Observation;
                worksheet.Cell(row, 14).Value = resolution.SecondObservation;
                worksheet.Cell(row, 15).Value = resolution.CreatedDate;

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
