using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TicketHistory;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TicketHistoryServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TicketHistoryService
{
    public class TicketHistoryService : ITicketHistoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public TicketHistoryService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<TicketHistoryDto>>> GetAllAsync()
        {
            var entities = await _context.TicketHistories
                .Include(th => th.Ticket)
                    .ThenInclude(t => t.SoftwareSystem)
                .Include(th => th.Resolution)
                .Include(th => th.User)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<TicketHistoryDto>>(entities);

            return new ResponseDto<IEnumerable<TicketHistoryDto>>
            {
                Status = true,
                StatusCode = 200,
                Data = dtos
            };
        }

        public async Task<ResponseDto<TicketHistoryDto>> GetByIdAsync(long id)
        {
            var entity = await _context.TicketHistories
                .Include(th => th.Ticket)
                    .ThenInclude(t => t.SoftwareSystem)
                .Include(th => th.Resolution)
                .Include(th => th.User)
                .FirstOrDefaultAsync(th => th.Id == id);

            if (entity == null)
            {
                return new ResponseDto<TicketHistoryDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Registro histórico no encontrado."
                };
            }

            return new ResponseDto<TicketHistoryDto>
            {   
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<TicketHistoryDto>(entity)
            };
        }

        // Método para ser llamado automáticamente desde ResolutionService
        public async Task<ResponseDto<TicketHistoryDto>> CreateAsync(long ticketId, long resolutionId, long userId)
        {
            var history = new TicketHistoryEntity
            {
                IdTicket = ticketId,
                IdResolution = resolutionId,
                IdUser = userId,
                CloseDate = DateTime.Now,
                CreatedDate = DateTime.Now,
                CreatedBy = userId
            };

            _context.TicketHistories.Add(history);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(history.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.TicketHistories.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se encontró el registro para eliminar."
                };
            }

            // Aquí aplicamos el Soft Delete 
            _context.TicketHistories.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool>
            {
                Status = true,
                StatusCode = 200,
                Data = true
            };
        }
    }
}