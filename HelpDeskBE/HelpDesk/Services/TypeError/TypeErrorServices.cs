using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.TypeErrorDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TypeError;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class TypeErrorService : ITypeErrorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public TypeErrorService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<TypeErrorDto>>> GetAllAsync()
        {
            var entities = await _context.TypeErrors.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<TypeErrorDto>>(entities);

            return new ResponseDto<IEnumerable<TypeErrorDto>>
            {
                Status = true,
                Data = dtos,
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<TypeErrorDto>> GetByIdAsync(long id)
        {
            var entity = await _context.TypeErrors.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<TypeErrorDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Tipo de error no encontrado."
                };
            }

            return new ResponseDto<TypeErrorDto>
            {
                Status = true,
                Data = _mapper.Map<TypeErrorDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<TypeErrorDto>> CreateAsync(CreateTypeErrorDto dto)
        {
            var entity = _mapper.Map<TypeErrorEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;  

            _context.TypeErrors.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<TypeErrorDto>
            {
                Status = true,
                Data = _mapper.Map<TypeErrorDto>(entity),
                StatusCode = 201 // Created
            };
        }

        public async Task<ResponseDto<TypeErrorDto>> UpdateAsync(UpdateTypeErrorDto dto, long id)
        {
            var entity = await _context.TypeErrors.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<TypeErrorDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: el tipo de error no existe."
                };
            }

            // Mapeo sobre el objeto existente para actualizar campos
            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.TypeErrors.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<TypeErrorDto>
            {
                Status = true,
                Data = _mapper.Map<TypeErrorDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.TypeErrors.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool>
                {
                    Status = false,
                    Data = false,
                    StatusCode = 404,
                    Message = "El registro ya no existe."
                };
            }

            _context.TypeErrors.Remove(entity);
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