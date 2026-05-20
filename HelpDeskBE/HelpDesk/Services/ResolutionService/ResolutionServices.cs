using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.ResolutionDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.ResolutionService;
using HelpDesk.Services.TicketHistoryServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class ResolutionServices: IResolutionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ITicketHistoryService _historyService;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public ResolutionServices(ApplicationDbContext context, IMapper mapper, ITicketHistoryService historyService, IAuthService authService, ILogger<ResolutionServices> logger)
        {
            _context = context;
            _mapper = mapper;
            _historyService = historyService;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<ResolutionDto>> GetAllAsync(ResolutionFilterDto filter)
        {
            try
            {
                var query = _context.Resolutions
                    .Include(r => r.Ticket)
                    .Include(r => r.User)
                    .Include(r => r.SolutionStatus)
                    .Include(r => r.Device)
                    .Include(r => r.Priority)
                    .AsQueryable();

                if (filter.IdTicket.HasValue)
                {
                    query = query.Where(r => r.IdTicket == filter.IdTicket.Value);
                }

                if (filter.IdUser.HasValue)
                {
                    query = query.Where(r => r.IdUser == filter.IdUser.Value);
                }

                if (filter.IdSolutionStatus.HasValue)
                {
                    query = query.Where(r => r.IdSolutionStatus == filter.IdSolutionStatus.Value);
                }

                if (filter.IdDevice.HasValue)
                {
                    query = query.Where(r => r.IdDevice == filter.IdDevice.Value);
                }

                if (filter.IdPriority.HasValue)
                {
                    query = query.Where(r => r.IdPriority == filter.IdPriority.Value);
                }

                if (!string.IsNullOrWhiteSpace(filter.Keyword))
                {
                    string term = filter.Keyword.Trim().ToLower();
                    query = query.Where(r => r.RootCause.ToLower().Contains(term)
                                           || r.Observation.ToLower().Contains(term));
                }

                if (filter.DateFrom.HasValue)
                {
                    query = query.Where(r => r.ResolutionDate >= filter.DateFrom.Value);
                }

                if (filter.DateTo.HasValue)
                {
                    var endOfDay = filter.DateTo.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(r => r.ResolutionDate <= endOfDay);
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var dtos = _mapper.Map<IEnumerable<ResolutionDto>>(entities);

                return new PagedResponseDto<ResolutionDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Listado de resoluciones obtenido correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el listado de resoluciones paginado.");
                return new PagedResponseDto<ResolutionDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar las resoluciones."
                };
            }
        }

        public async Task<ResponseDto<ResolutionDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Resolutions
                .Include(r => r.Ticket)
                .Include(r => r.User)
                .Include(r => r.SolutionStatus)
                .Include(r => r.Device)
                .Include(r => r.Priority)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (entity == null)
            {
                return new ResponseDto<ResolutionDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Resolución no encontrada."
                };
            }

            return new ResponseDto<ResolutionDto>
            {
                Status = true,
                Data = _mapper.Map<ResolutionDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<ResolutionDto>> CreateAsync(CreateResolutionDto dto)
        {
            // 1. Validar que el ticket exista 
            var ticket = await _context.Tickets.FindAsync(dto.IdTicket);
            var currentUserId = _authService.GetUserId();
            if (ticket == null)
            {
                return new ResponseDto<ResolutionDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "El ticket no existe."
                };
            }

            // 2. Mapear DTO a Entidad
            var entity = _mapper.Map<ResolutionEntity>(dto);

            // 3. Cálculos y Auditoría
            var timeSpan = DateTime.Now - ticket.ReportDate;
            entity.SolutionTime = (decimal)timeSpan.TotalHours;
            entity.ResolutionDate = DateTime.Now;
            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId; 
            entity.IdUser = currentUserId;

            // 4. Guardar la Resolución
            _context.Resolutions.Add(entity);

            // Cambiamos el estado del ticket a inactivo
            ticket.IsActive = false;
            _context.Tickets.Update(ticket);

            // Guardamos cambios para que se genere el ID de la resolución
            await _context.SaveChangesAsync();

            // 5. CREAR EL HISTORIAL AUTOMÁTICAMENTE
            await _historyService.CreateAsync(ticket.Id, entity.Id, entity.IdUser);

            // 6. Retornar la respuesta final (con los datos cargados)
            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<ResolutionDto>> UpdateAsync(UpdateResolutionDto dto, long id)
        {
            var entity = await _context.Resolutions.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<ResolutionDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar la resolución."
                };
            }

            _mapper.Map(dto, entity);
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Resolutions.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.Resolutions.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Message = "Registro no encontrado." };
            }
      
            _context.Resolutions.Remove(entity);

            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, Data = true, StatusCode = 200 };
        }
    }
}