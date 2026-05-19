using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.PriorityDto;
using HelpDesk.Dtos.SoftwareSystemDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.PriorityServices;
using HelpDesk.Services.SoftwareSystemServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class PriorityService : IPriorityService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public PriorityService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<PriorityDto>>> GetAllAsync()
        {
            var entities = await _context.Priorities.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<PriorityDto>>(entities);

            return new ResponseDto<IEnumerable<PriorityDto>>
            {
                Status = true,
                Data = dtos,
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<PriorityDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Priorities.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<PriorityDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Prioridad no encontrado."
                };
            }

            return new ResponseDto<PriorityDto>
            {
                Status = true,
                Data = _mapper.Map<PriorityDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<PriorityDto>> CreateAsync(CreatePriorityDto dto)
        {
            var entity = _mapper.Map<PriorityEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;

            _context.Priorities.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<PriorityDto>
            {
                Status = true,
                Data = _mapper.Map<PriorityDto>(entity),
                StatusCode = 201
            };
        }

        public async Task<ResponseDto<PriorityDto>> UpdateAsync(UpdatePriorityDto dto, long id)
        {
            var entity = await _context.Priorities.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<PriorityDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: La prioridad no existe."
                };
            }

            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Priorities.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<PriorityDto>
            {
                Status = true,
                Data = _mapper.Map<PriorityDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.Priorities.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool>
                {
                    Status = false,
                    Data = false,
                    StatusCode = 404,
                    Message = "El sistema ya no existe."
                };
            }

            _context.Priorities.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool>
            {
                Status = true,
                Data = true,
                StatusCode = 200
            };
        }
    }
}