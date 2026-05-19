using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.SoftwareSystemDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.SoftwareSystemServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class SoftwareSystemService : ISoftwareSystemService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public SoftwareSystemService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<SoftwareSystemDto>>> GetAllAsync()
        {
            var entities = await _context.SoftwareSystems.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<SoftwareSystemDto>>(entities);

            return new ResponseDto<IEnumerable<SoftwareSystemDto>>
            {
                Status = true,
                Data = dtos,
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<SoftwareSystemDto>> GetByIdAsync(long id)
        {
            var entity = await _context.SoftwareSystems.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<SoftwareSystemDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Sistema no encontrado."
                };
            }

            return new ResponseDto<SoftwareSystemDto>
            {
                Status = true,
                Data = _mapper.Map<SoftwareSystemDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<SoftwareSystemDto>> CreateAsync(CreateSoftwareSystemDto dto)
        {
            var entity = _mapper.Map<SoftwareSystemEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId; 

            _context.SoftwareSystems.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<SoftwareSystemDto>
            {
                Status = true,
                Data = _mapper.Map<SoftwareSystemDto>(entity),
                StatusCode = 201
            };
        }

        public async Task<ResponseDto<SoftwareSystemDto>> UpdateAsync(UpdateSoftwareSystemDto dto, long id)
        {
            var entity = await _context.SoftwareSystems.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<SoftwareSystemDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: el sistema no existe."
                };
            }

            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.SoftwareSystems.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<SoftwareSystemDto>
            {
                Status = true,
                Data = _mapper.Map<SoftwareSystemDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.SoftwareSystems.FindAsync(id);

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

            _context.SoftwareSystems.Remove(entity);
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