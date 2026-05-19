using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.RolesDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.RolServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class RolService : IRolService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public RolService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<RolDto>>> GetAllAsync()
        {
            var roles = await _context.Roles.ToListAsync();
            var data = _mapper.Map<IEnumerable<RolDto>>(roles);

            return new ResponseDto<IEnumerable<RolDto>>
            {
                Data = data,
                Status = true,
                Message = "Roles obtenidos correctamente."
            };
        }

        public async Task<ResponseDto<RolDto>> GetByIdAsync(long id)
        {
            var rolEntity = await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);

            if (rolEntity == null)
                return new ResponseDto<RolDto> { Status = false, Message = "Rol no encontrado." };

            var data = _mapper.Map<RolDto>(rolEntity);
            return new ResponseDto<RolDto> { Data = data, Status = true };
        }

        public async Task<ResponseDto<RolDto>> CreateAsync(CreateRolDto dto)
        {
            try
            {
                // Validación: No duplicar roles por nombre 
                var exists = await _context.Roles.AnyAsync(r => r.Name.ToLower() == dto.Name.ToLower());
                if (exists)
                    return new ResponseDto<RolDto> { Status = false, Message = "Este rol ya existe." };

                var rolEntity = _mapper.Map<RolEntity>(dto);

                _context.Roles.Add(rolEntity);
                await _context.SaveChangesAsync();

                var data = _mapper.Map<RolDto>(rolEntity);
                return new ResponseDto<RolDto> { Data = data, Status = true, Message = "Rol creado con éxito." };
            }
            catch (Exception ex)
            {
                return new ResponseDto<RolDto> { Status = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ResponseDto<RolDto>> UpdateAsync(UpdateRolDto dto, long id)
        {
            var rolEntity = await _context.Roles.FindAsync(id);

            if (rolEntity == null)
                return new ResponseDto<RolDto> { Status = false, Message = "Rol no encontrado para actualizar." };

            _mapper.Map(dto, rolEntity);

            _context.Roles.Update(rolEntity);
            await _context.SaveChangesAsync();

            var data = _mapper.Map<RolDto>(rolEntity);
            return new ResponseDto<RolDto> { Data = data, Status = true, Message = "Rol actualizado correctamente." };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var rolEntity = await _context.Roles.FindAsync(id);

            if (rolEntity == null)
                return new ResponseDto<bool> { Status = false, Data = false, Message = "Rol no encontrado." };

            // si hay usuarios asociados a él para no romper la integridad referencial.
            var hasUsers = await _context.Users.AnyAsync(u => u.IdRol == id);
            if (hasUsers)
                return new ResponseDto<bool> { Status = false, Data = false, Message = "No se puede eliminar el rol porque tiene usuarios asociados." };

            _context.Roles.Remove(rolEntity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, Data = true, Message = "Rol eliminado exitosamente." };
        }
    }
}