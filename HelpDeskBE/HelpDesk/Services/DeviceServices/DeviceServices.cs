using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.DeviceDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.DeviceServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.DeviceService
{
    public class DeviceService : IDeviceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public DeviceService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<DeviceDto>>> GetAllAsync()
        {
            var entities = await _context.Devices
                .Include(d => d.TypeDevices)
                .Include(d => d.Users)
                .Include(d => d.Areas)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<DeviceDto>>(entities);

            return new ResponseDto<IEnumerable<DeviceDto>>
            {
                Status = true,
                StatusCode = 200,
                Data = dtos
            };
        }

        public async Task<ResponseDto<DeviceDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Devices
                .Include(d => d.TypeDevices)
                .Include(d => d.Users)
                .Include(d => d.Areas)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (entity == null)
            {
                return new ResponseDto<DeviceDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "El equipo solicitado no existe."
                };
            }

            return new ResponseDto<DeviceDto>
            {
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<DeviceDto>(entity)
            };
        }

        public async Task<ResponseDto<DeviceDto>> CreateAsync(CreateDeviceDto dto)
        {
            // Validar si el código de inventario ya existe
            var exists = await _context.Devices.AnyAsync(d => d.Code == dto.Code);
            if (exists)
            {   
                return new ResponseDto<DeviceDto>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = $"El código de inventario '{dto.Code}' ya está registrado."
                };
            }

            var entity = _mapper.Map<DeviceEntity>(dto);

            var currentUserId = _authService.GetUserId();
            // Datos de auditoría
            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId; 
            entity.IsActive = true;

            _context.Devices.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<DeviceDto>> UpdateAsync(UpdateDeviceDto dto, long id)
        {
            var entity = await _context.Devices.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<DeviceDto> { Status = false, StatusCode = 404 };
            }
            var currentUserId = _authService.GetUserId();

            _mapper.Map(dto, entity);
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Devices.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.Devices.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            _context.Devices.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}