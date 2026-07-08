using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.SLA;
using System;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HelpDesk.Services.SlaService
{
    public class SlaGoalService : ISlaGoalService
    {
        private readonly ApplicationDbContext _context;

        public SlaGoalService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ResponseDto<bool>> SaveAsync(SaveSlaGoalDto dto)
        {
            try
            {
                // Buscamos si ya existe una meta registrada para ese mes y año exacto
                var existingGoal = await _context.SlaGoals
                    .FirstOrDefaultAsync(g => g.Year == dto.Year && g.Month == dto.Month);

                if (existingGoal == null)
                {
                    // Si no existe, creamos la nueva fila (CREATE)
                    existingGoal = new SlaGoalEntity
                    {
                        Year = dto.Year, 
                        Month = dto.Month
                    };
                    _context.SlaGoals.Add(existingGoal);
                }

                // Si existe o se acaba de crear, actualizamos el valor y la fecha (UPDATE)
                existingGoal.GoalValue = dto.GoalValue;
                existingGoal.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return new ResponseDto<bool>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Meta del SLA guardada correctamente.",
                    Data = true
                };
            }
            catch (Exception)
            {
                return new ResponseDto<bool>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno al procesar la meta.",
                    Data = false
                };
            }
        }
    }
}
