using ClosedXML.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using HelpDesk.Database;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;

namespace HelpDesk.Services.DeviceExportService
{

    public class DeviceExportService : IDeviceExportService
    {
        private readonly ApplicationDbContext _context;

        public DeviceExportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> ExportDevicesToExcelAsync()
        {
            // Traer datos de la BD
            var devices = await _context.Devices
                .Include(d => d.Areas)
                     .ThenInclude(a => a.Agencies)
                .Include(d => d.TypeDevices)
                .Include(d => d.Users)
                .ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Dispositivos");

            // Cabecera institucional
            worksheet.Cell(1, 1).Value = "SISTEMA HELPDESK - INVENTARIO DE DISPOSITIVOS";
            worksheet.Range("A1:I1").Merge().Style.Font.SetBold().Font.FontColor = XLColor.White;
            worksheet.Range("A1:I1").Style.Fill.BackgroundColor = XLColor.FromHtml("#1a558b");

            // Cabeceras de columnas
            worksheet.Cell(3, 1).Value = "ID";
            worksheet.Cell(3, 2).Value = "Nombre / Modelo";
            worksheet.Cell(3, 3).Value = "Codigo";
            worksheet.Cell(3, 4).Value = "Area / Departamento";
            worksheet.Cell(3, 5).Value = "Agencia";
            worksheet.Cell(3, 6).Value = "Estado";
            worksheet.Cell(3, 7).Value = "Usuario Asignado";
            worksheet.Cell(3, 8).Value = "Tipo de Dispositivo";
            worksheet.Cell(3, 9).Value = "Observaciones Tecnicas";

            var headerRange = worksheet.Range("A3:I3");
            headerRange.Style.Font.SetBold().Fill.BackgroundColor = XLColor.LightGray;

   
            // Llenar datos
            int row = 4;
            foreach (var device in devices)
            {
                string estadoTexto;
                if (device.IsActive)
                {
                    estadoTexto = "Operando";
                }
                else
                {
                    estadoTexto = "Inactivo";
                }

                worksheet.Cell(row, 1).Value = device.Id;
                worksheet.Cell(row, 2).Value = device.BrandName;
                worksheet.Cell(row, 3).Value = device.Code;
                worksheet.Cell(row, 4).Value = device.Areas?.NameArea ?? "N/A";
                worksheet.Cell(row, 5).Value = device.Areas?.Agencies?.Name;
                worksheet.Cell(row, 6).Value = estadoTexto;
                worksheet.Cell(row, 7).Value = device.Users?.UserName ?? "N/A";
                worksheet.Cell(row, 8).Value = device.TypeDevices?.Name ?? "N/A";
                worksheet.Cell(row, 9).Value = device.Observation;

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
