using HelpDesk.Database;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Helpers;
using HelpDesk.Models;
using HelpDesk.Services.AuditService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.AuditServices
{
    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _context;

        public AuditService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponseDto<AuditLog>> GetAllAsync(AuditFilterDto pagination)
        {
            try
            {
                // 1. Armamos la consulta base apuntando a la tabla de auditoría
                var query = _context.AuditLogs.AsQueryable();

                // 2. Filtramos por la palabra clave si el usuario escribió en el Front
                if (!string.IsNullOrEmpty(pagination.Keyword))
                {
                    string keyword = pagination.Keyword.ToLower().Trim();
                    query = query.Where(x =>
                        x.UserName.ToLower().Contains(keyword) ||
                        x.Action.ToLower().Contains(keyword) ||
                        x.TableName.ToLower().Contains(keyword) ||
                        x.Description.ToLower().Contains(keyword)
                    );
                }

                // 3. Ordenamos para que los logs más recientes salgan primero
                query = query.OrderByDescending(x => x.CreatedAt);

                // 4. Aplicamos el método de paginación de la financiera
                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(pagination.PageNumber, pagination.PageSize);

                // 5. Retornamos usando PagedResponseDto para que el Front lea "TotalItems"
                return new PagedResponseDto<AuditLog>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Listado de auditoría recuperado con éxito.",
                    Data = entities, // Mandamos la lista paginada directa
                    CurrentPage = pagination.PageNumber,
                    PageSize = pagination.PageSize,
                    TotalItems = totalItems, 
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                return new PagedResponseDto<AuditLog>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = $"Error interno del servidor al recuperar los datos: {ex.Message}"
                };
            }
        }
    }
}