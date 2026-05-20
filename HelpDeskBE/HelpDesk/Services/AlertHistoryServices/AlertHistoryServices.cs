using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AlertHistoryDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AlertHistoryServices;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.AlertHistoryService
{
    public class AlertHistoryService : IAlertHistoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public AlertHistoryService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<AlertHistoryService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;  
        }

        public async Task<PagedResponseDto<AlertHistoryDto>> GetAllAsync(AlertHistoryFilterDto filter)
        {
            try
            {
                var query = _context.AlertHistories
                    .Include(ah => ah.AlertConfiguration)
                    .Include(ah => ah.User)
                    .AsQueryable();
                if (filter.IdAlertConfiguration.HasValue)
                {
                    query = query.Where(ah => ah.IdAlertConfiguration == filter.IdAlertConfiguration.Value);
                }

                if (filter.IdUser.HasValue)
                {
                    query = query.Where(ah => ah.IdUser == filter.IdUser.Value);
                }

                if (filter.DateFrom.HasValue)
                {
                    query = query.Where(ah => ah.ActionDate >= filter.DateFrom.Value);
                }

                if (filter.DateTo.HasValue)
                {
                    var endOfDay = filter.DateTo.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(ah => ah.ActionDate <= endOfDay);
                }
                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var dtos = _mapper.Map<IEnumerable<AlertHistoryDto>>(entities);

                return new PagedResponseDto<AlertHistoryDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Historial de alertas recuperado correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el historial de alertas.");
                return new PagedResponseDto<AlertHistoryDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno al recuperar el historial."
                };
            }
        }
        public async Task<ResponseDto<AlertHistoryDto>> GetByIdAsync(long id)
        {
            var entity = await _context.AlertHistories
                .Include(ah => ah.AlertConfiguration)
                .Include(ah => ah.User)
                .FirstOrDefaultAsync(ah => ah.Id == id);

            if (entity == null)
            {
                return new ResponseDto<AlertHistoryDto> { Status = false, StatusCode = 404, Message = "Registro de historial de alerta no encontrado." };
            }

            return new ResponseDto<AlertHistoryDto> { Status = true, StatusCode = 200, Data = _mapper.Map<AlertHistoryDto>(entity) };
        }

        public async Task<ResponseDto<AlertHistoryDto>> CreateAsync(long alertConfigurationId, long executedByUserId)
        {
            var currentDate = DateTime.Now;

            var entity = new AlertHistoryEntity
            {
                IdAlertConfiguration = alertConfigurationId,
                IdUser = executedByUserId,
                ActionDate = currentDate,
                CreatedBy = executedByUserId,
                CreatedDate = currentDate,
            };

            _context.AlertHistories.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }
    }
}