using ClosedXML.Excel;
using HelpDesk.Database;
using HelpDesk.Models;  
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.AuditLogExportService
{
    public class AuditLogExportService : IAuditLogExportService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogExportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> ExportAuditLogsToExcelAsync(int year, int? month)
        {
            // 1. Consultar la tabla AuditLogs  
            var query = _context.AuditLogs.AsQueryable();
 
            if (year > 0)
            {
                query = query.Where(a => a.CreatedAt.Year == year);
            }
 
            if (month.HasValue && month.Value >= 1 && month.Value <= 12)
            {
                query = query.Where(a => a.CreatedAt.Month == month.Value);
            }

            // 2. Ejecutar la consulta ordenada de la más reciente a la más antigua
            var logs = await query
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Bitácora de Auditoría");

            // --- Encabezado Principal ---
            string periodo = month.HasValue ? $"{month:00}/{year}" : $"Año {year}";
            worksheet.Cell(1, 1).Value = $"SISTEMA HELPDESK - BITÁCORA DE AUDITORÍA Y REGISTROS ({periodo})";
            worksheet.Range("A1:F1").Merge().Style.Font.SetBold().Font.FontColor = XLColor.White;
            worksheet.Range("A1:F1").Style.Fill.BackgroundColor = XLColor.FromHtml("#1a558b");
            worksheet.Range("A1:F1").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

            // --- Columnas de la Tabla ---
            worksheet.Cell(3, 1).Value = "ID";
            worksheet.Cell(3, 2).Value = "Fecha y Hora (UTC)";
            worksheet.Cell(3, 3).Value = "Usuario";
            worksheet.Cell(3, 4).Value = "Acción";
            worksheet.Cell(3, 5).Value = "Tabla / Módulo";
            worksheet.Cell(3, 6).Value = "Descripción";

            var headerRange = worksheet.Range("A3:F3");
            headerRange.Style.Font.SetBold().Fill.BackgroundColor = XLColor.LightGray;
            headerRange.Style.Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            // --- Llenar Filas de Datos ---
            int row = 4;
            foreach (var log in logs)
            {
                worksheet.Cell(row, 1).Value = log.Id;
                worksheet.Cell(row, 2).Value = log.CreatedAt.ToString("dd/MM/yyyy HH:mm:ss");
                worksheet.Cell(row, 3).Value = !string.IsNullOrWhiteSpace(log.UserName) ? log.UserName : "Sistema";
                worksheet.Cell(row, 4).Value = log.Action;  
                worksheet.Cell(row, 5).Value = log.TableName;
                worksheet.Cell(row, 6).Value = log.Description;

                // Color según el tipo de acción para mejor lectura
                var actionCell = worksheet.Cell(row, 4);
                if (log.Action == "CREATE")
                {
                    actionCell.Style.Font.FontColor = XLColor.DarkGreen;
                    actionCell.Style.Font.Bold = true;
                }
                else if (log.Action == "DELETE")
                {
                    actionCell.Style.Font.FontColor = XLColor.DarkRed;
                    actionCell.Style.Font.Bold = true;
                }
                else if (log.Action == "UPDATE")
                {
                    actionCell.Style.Font.FontColor = XLColor.DarkBlue;
                }

                row++;
            }

            // Autoajustar formato de columnas
            worksheet.Columns().AdjustToContents();
            worksheet.Column(6).Width = 55; // Dar espacio suficiente a la descripción

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}