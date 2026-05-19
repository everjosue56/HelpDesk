using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TypeDevicesDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TypeDeviceServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeDeviceService
{
    public class TypeDeviceService : ITypeDevicesService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public TypeDeviceService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<TypeDevicesDto>>> GetAllAsync()
        {
            var entities = await _context.TypeDevices.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<TypeDevicesDto>>(entities);

            return new ResponseDto<IEnumerable<TypeDevicesDto>>
            {
                Status = true,
                StatusCode = 200,
                Data = dtos
            };
        }

        public async Task<ResponseDto<TypeDevicesDto>> GetByIdAsync(long id)
        {
            var entity = await _context.TypeDevices.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<TypeDevicesDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Tipo de dispositivo no encontrado."
                };
            }

            return new ResponseDto<TypeDevicesDto>
            {
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<TypeDevicesDto>(entity)
            };
        }

        public async Task<ResponseDto<TypeDevicesDto>> CreateAsync(CreateTypeDevicesDto dto)
        {
            var entity = _mapper.Map<TypeDeviceEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId; 

            _context.TypeDevices.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<TypeDevicesDto>> UpdateAsync(UpdateTypeDevicesDto dto, long id)
        {
            var entity = await _context.TypeDevices.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<TypeDevicesDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: El registro no existe."
                };
            }

            _mapper.Map(dto, entity);
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.TypeDevices.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.TypeDevices.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            _context.TypeDevices.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}