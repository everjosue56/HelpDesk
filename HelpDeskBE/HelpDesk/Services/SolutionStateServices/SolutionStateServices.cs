using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.SolutionStateDto;
using HelpDesk.Dtos.TypeErrorDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.SolutionStateServices;
using HelpDesk.Services.TypeError;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class SolutionStateService : ISolutionStateService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public SolutionStateService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<SolutionStateDto>>> GetAllAsync()
        {
            var entities = await _context.SolutionsState.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<SolutionStateDto>>(entities);

            return new ResponseDto<IEnumerable<SolutionStateDto>>
            {
                Status = true,
                Data = dtos,
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<SolutionStateDto>> GetByIdAsync(long id)
        {
            var entity = await _context.SolutionsState.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<SolutionStateDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Tipo de estado no encontrado."
                };
            }

            return new ResponseDto<SolutionStateDto>
            {
                Status = true,
                Data = _mapper.Map<SolutionStateDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<SolutionStateDto>> CreateAsync(CreateSolutionStateDto dto)
        {
            var entity = _mapper.Map <SolutionStatusEntity>(dto);
            var currentUserId = _authService.GetUserId();

            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId;  

            _context.SolutionsState.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<SolutionStateDto>
            {
                Status = true,
                Data = _mapper.Map<SolutionStateDto>(entity),
                StatusCode = 201 // Created
            };
        }

        public async Task<ResponseDto<SolutionStateDto>> UpdateAsync(UpdateSolutionStateDto dto, long id)
        {
            var entity = await _context.SolutionsState.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<SolutionStateDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: el tipo de estado no existe."
                };
            }

            // Mapeo sobre el objeto existente para actualizar campos
            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.SolutionsState.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<SolutionStateDto>
            {
                Status = true,
                Data = _mapper.Map<SolutionStateDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.SolutionsState.FindAsync(id);

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

            _context.SolutionsState.Remove(entity);
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