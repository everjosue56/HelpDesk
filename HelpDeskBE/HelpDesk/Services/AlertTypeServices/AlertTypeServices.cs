using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AlertTypeDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Services.AlertTypeServices;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.AlertTypeService
{
    public class AlertTypeService : IAlertTypeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public AlertTypeService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<AlertTypeDto>>> GetAllAsync()
        {
            var entities = await _context.AlertsType.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<AlertTypeDto>>(entities);

            return new ResponseDto<IEnumerable<AlertTypeDto>> { Status = true, StatusCode = 200, Data = dtos };
        }

        public async Task<ResponseDto<AlertTypeDto>> GetByIdAsync(long id)
        {
            var entity = await _context.AlertsType.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<AlertTypeDto> { Status = false, StatusCode = 404, Message = "El tipo de alerta no existe." };
            }

            return new ResponseDto<AlertTypeDto> { Status = true, StatusCode = 200, Data = _mapper.Map<AlertTypeDto>(entity) };
        }

        public async Task<ResponseDto<AlertTypeDto>> CreateAsync(CreateAlertTypeDto dto)
        {
            // Validar duplicados para evitar nombres repetidos
            var exists = await _context.AlertsType.AnyAsync(a => a.Name.ToLower() == dto.Name.ToLower());
            if (exists)
            {
                return new ResponseDto<AlertTypeDto> { Status = false, StatusCode = 400, Message = $"El tipo de alerta '{dto.Name}' ya existe." };
            }

            var entity = _mapper.Map<AlertTypeEntity>(dto);
            entity.CreatedBy = _authService.GetUserId();
            entity.CreatedDate = DateTime.Now;

            _context.AlertsType.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<AlertTypeDto>> UpdateAsync(UpdateAlertTypeDto dto, long id)
        {
            var entity = await _context.AlertsType.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<AlertTypeDto> { Status = false, StatusCode = 404, Message = "Tipo de alerta no encontrado." };
            }

            _mapper.Map(dto, entity);
            entity.UpdatedBy = _authService.GetUserId();
            entity.UpdatedDate = DateTime.Now;

            _context.AlertsType.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.AlertsType.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }
            _context.AlertsType.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}