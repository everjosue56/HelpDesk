using ClosedXML.Excel;
using HelpDesk.Database;
using HelpDesk.Services.TicketExportService;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;

namespace HelpDesk.Services.UserExportService
{
    public class UserExportService : IUserExportService
    {
        private readonly ApplicationDbContext _context;

        public UserExportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> ExportUserToExcelAsync()
        {
            var users = await _context.Users
                .Include(u => u.Agency)
                .Include(u => u.Roles)
                .Include(U => U.Area)
                .IgnoreQueryFilters()
                .ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Usuarios");

            // Cabecera institucional
            worksheet.Cell(1, 1).Value = "SISTEMA HELPDESK - SOPORTE A USUARIOS";
            worksheet.Range("A1:J1").Merge().Style.Font.SetBold().Font.FontColor = XLColor.White;
            worksheet.Range("A1:J1").Style.Fill.BackgroundColor = XLColor.FromHtml("#1a558b");

            worksheet.Cell(3, 1).Value = "ID";
            worksheet.Cell(3, 2).Value = "Nombre Completo";
            worksheet.Cell(3, 3).Value = "Correo Electronico";
            worksheet.Cell(3, 4).Value = "Nombre de Usuario";
            worksheet.Cell(3, 5).Value = "Telefono";
            worksheet.Cell(3, 6).Value = "Rol";
            worksheet.Cell(3, 7).Value = "Agencia";
            worksheet.Cell(3, 8).Value = "Area/Departamento";
            worksheet.Cell(3, 9).Value = "Estado";
            worksheet.Cell(3, 10).Value = "Fecha de Creacion";

            var headerRange = worksheet.Range("A3:J3");
            headerRange.Style.Font.SetBold().Fill.BackgroundColor = XLColor.LightGray;

            int row = 4;
            foreach (var user in users)
            {
                string estadoTexto;
                if (user.IsActive)
                {
                    estadoTexto = "Activo";
                }
                else
                {
                    estadoTexto = "Inactivo";
                }

                worksheet.Cell(row, 1).Value = user.Id;
                worksheet.Cell(row, 2).Value = $"{user.FirstName} {user.LastName}";
                worksheet.Cell(row, 3).Value = user.Email;
                worksheet.Cell(row, 4).Value = user.UserName;
                worksheet.Cell(row, 5).Value = user.PhoneNumber;
                worksheet.Cell(row, 6).Value = user.Roles?.Name ?? "N/A";
                worksheet.Cell(row, 7).Value = user.Agency?.Name ?? "N/A";
                worksheet.Cell(row, 8).Value = user.Area?.NameArea ?? "N/A";
                worksheet.Cell(row, 9).Value = estadoTexto;
                worksheet.Cell(row, 10).Value = user.CreatedDate;

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
