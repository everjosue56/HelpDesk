using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AlertHistoryDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Services.AlertHistoryServices;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
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

        public AlertHistoryService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<AlertHistoryDto>>> GetAllAsync()
        {
            var entities = await _context.AlertHistories
                 .OrderByDescending(ah => ah.ActionDate)
                .Include(ah => ah.AlertConfiguration) 
                .Include(ah => ah.User)           
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<AlertHistoryDto>>(entities);
            return new ResponseDto<IEnumerable<AlertHistoryDto>> { Status = true, StatusCode = 200, Data = dtos };
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