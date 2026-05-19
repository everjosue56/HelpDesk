using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TypeMaintenanceDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TypeMaintenanceServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeMaintenanceService
{
    public class TypeMaintenanceService : ITypeMaintenanceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        public TypeMaintenanceService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<TypeMaintenanceDto>>> GetAllAsync()
        {
            var entities = await _context.TypeMaintenances.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<TypeMaintenanceDto>>(entities);

            return new ResponseDto<IEnumerable<TypeMaintenanceDto>>
            {
                Status = true,
                StatusCode = 200,
                Data = dtos
            };
        }

        public async Task<ResponseDto<TypeMaintenanceDto>> GetByIdAsync(long id)
        {
            var entity = await _context.TypeMaintenances.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<TypeMaintenanceDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Tipo de mantenimiento no encontrado."
                };
            }

            return new ResponseDto<TypeMaintenanceDto>
            {
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<TypeMaintenanceDto>(entity)
            };
        }

        public async Task<ResponseDto<TypeMaintenanceDto>> CreateAsync(CreateTypeMaintenanceDto dto)
        {
            var entity = _mapper.Map<TypeMaintenanceEntity>(dto);
            var currentUserId = _authService.GetUserId();
            // Auditoría manual
            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;

            _context.TypeMaintenances.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<TypeMaintenanceDto>> UpdateAsync(UpdateTypeMaintenanceDto dto, long id)
        {
            var entity = await _context.TypeMaintenances.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<TypeMaintenanceDto> { Status = false, StatusCode = 404 };
            }

            _mapper.Map(dto, entity);
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.TypeMaintenances.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.TypeMaintenances.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            _context.TypeMaintenances.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}