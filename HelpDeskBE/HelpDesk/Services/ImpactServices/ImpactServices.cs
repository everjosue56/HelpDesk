using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.ImpactDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.ImpactServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class ImpactService : IImpactService 
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public ImpactService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<ImpactDto>>> GetAllAsync()
        {
            var entities = await _context.Impacts.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<ImpactDto>>(entities);

            return new ResponseDto<IEnumerable<ImpactDto>>
            {
                Status = true,
                Data = dtos,
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<ImpactDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Impacts.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<ImpactDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Impacto no encontrado."  
                };
            }

            return new ResponseDto<ImpactDto>
            {
                Status = true,
                Data = _mapper.Map<ImpactDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<ImpactDto>> CreateAsync(CreateImpactDto dto)
        {
            var entity = _mapper.Map<ImpactEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;

            _context.Impacts.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<ImpactDto>
            {
                Status = true,
                Data = _mapper.Map<ImpactDto>(entity),
                StatusCode = 201
            };
        }

        public async Task<ResponseDto<ImpactDto>> UpdateAsync(UpdateImpactDto dto, long id)
        {
           
            var entity = await _context.Impacts.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<ImpactDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: el impacto no existe."
                };
            }

            _mapper.Map(dto, entity);

            var currentUserId = _authService.GetUserId();

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Impacts.Update(entity);  
            await _context.SaveChangesAsync();

            return new ResponseDto<ImpactDto>
            {
                Status = true,
                Data = _mapper.Map<ImpactDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
          
            var entity = await _context.Impacts.FindAsync(id);

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

            _context.Impacts.Remove(entity);  
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