using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.OrganizationsDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.Organizations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class OrganizationService : IOrganizationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        public OrganizationService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<OrganizationDto>>> GetAllAsync()
        {
            var entities = await _context.Organizations.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<OrganizationDto>>(entities);

            return new ResponseDto<IEnumerable<OrganizationDto>>
            {
                Status = true,
                Data = dtos,
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<OrganizationDto>> GetByIdAsync(long id)
        {
            var entity = await _context.Organizations.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<OrganizationDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "Organización no encontrada."
                };
            }

            return new ResponseDto<OrganizationDto>
            {
                Status = true,
                Data = _mapper.Map<OrganizationDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<OrganizationDto>> CreateAsync(CreateOrganizationDto dto)
        {
            var entity = _mapper.Map<OrganizationEntity>(dto);
            var currentUserId = _authService.GetUserId();
            // Auditoría manual 
            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = currentUserId; 


            _context.Organizations.Add(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<OrganizationDto>
            {
                Status = true,
                Data = _mapper.Map<OrganizationDto>(entity),
                StatusCode = 201 // Created
            };
        }

        public async Task<ResponseDto<OrganizationDto>> UpdateAsync(UpdateOrganizationDto dto, long id)
        {
            var entity = await _context.Organizations.FindAsync(id);
            var currentUserId = _authService.GetUserId();

            if (entity == null)
            {
                return new ResponseDto<OrganizationDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "No se pudo actualizar: registro no encontrado."
                };
            }

            // Mapeo sobre el objeto existente para actualizar solo lo necesario
            _mapper.Map(dto, entity);

            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = currentUserId;

            _context.Organizations.Update(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<OrganizationDto>
            {
                Status = true,
                Data = _mapper.Map<OrganizationDto>(entity),
                StatusCode = 200
            };
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.Organizations.FindAsync(id);

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

            _context.Organizations.Remove(entity);
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