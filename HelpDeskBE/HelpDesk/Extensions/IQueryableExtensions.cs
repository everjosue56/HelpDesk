using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Helpers
{
    public static class IQueryableExtensions
    {
        public static async Task<Tuple<IEnumerable<T>, int, int>> ToPagedListAsync<T>(
            this IQueryable<T> source, int pageNumber, int pageSize)
        {
            // 1. Contamos el total de filas en la DB antes de cortar la consulta
            int totalItems = await source.CountAsync();

            // 2. Calculamos el total de páginas necesarias
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // 3. Aplicamos Skip y Take directamente a la consulta SQL
            var items = await source
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new Tuple<IEnumerable<T>, int, int>(items, totalItems, totalPages);
        }
    }
}