using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.AgencyService
{
    public class AgencyService : IAgencyService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<AgencyService> _logger;
        private readonly IAuthService _authService;

        public AgencyService(ApplicationDbContext context, IMapper mapper, ILogger<AgencyService> logger, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<AgencyDto>>> GetAllAsync()
        {
            try
            {
                var agenciesEntity = await _context.Agencies
                    .Include(a => a.Organizations) // Carga la relación para el AutoMapper
                    .Where(a => a.IsActive)       // Solo las activas (Borrado lógico)
                    .ToListAsync();

                var agenciesDto = _mapper.Map<IEnumerable<AgencyDto>>(agenciesEntity);

                return new ResponseDto<IEnumerable<AgencyDto>>
                {
                    Status = true,
                    Data = agenciesDto,
                    Message = "Agencias obtenidas correctamente."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las agencias.");
                return new ResponseDto<IEnumerable<AgencyDto>> { Status = false, Message = "Error interno del servidor." };
            }
        }

        public async Task<ResponseDto<AgencyDto>> GetByIdAsync(long id)
        {
            var agencyEntity = await _context.Agencies
                .Include(a => a.Organizations)
                .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);

            if (agencyEntity == null)
            {
                return new ResponseDto<AgencyDto> { Status = false, Message = "La agencia no existe." };
            }

            return new ResponseDto<AgencyDto>
            {
                Status = true,
                Data = _mapper.Map<AgencyDto>(agencyEntity)
            };
        }

        public async Task<ResponseDto<AgencyDto>> CreateAsync(CreateAgencyDto dto)
        {
            try
            {
                // Validar que la organización exista antes de crear
                var orgExists = await _context.Organizations.AnyAsync(o => o.Id == dto.IdOrganization);
                if (!orgExists)
                {
                    return new ResponseDto<AgencyDto> { Status = false, Message = "La organización especificada no existe." };
                }

                var agencyEntity = _mapper.Map<AgencyEntity>(dto);

                _context.Agencies.Add(agencyEntity);
                await _context.SaveChangesAsync();

                // Recargamos para incluir la organización en la respuesta
                return await GetByIdAsync(agencyEntity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la agencia.");
                return new ResponseDto<AgencyDto> { Status = false, Message = "No se pudo crear la agencia." };
            }
        }

        public async Task<ResponseDto<AgencyDto>> UpdateAsync(UpdateAgencyDto dto, long id)
        {
            try
            {
                var agencyEntity = await _context.Agencies.FindAsync(id);

                if (agencyEntity == null || !agencyEntity.IsActive)
                {
                    return new ResponseDto<AgencyDto> { Status = false, Message = "Agencia no encontrada." };
                }

                // Usamos AutoMapper para actualizar la entidad existente
                _mapper.Map(dto, agencyEntity);

                _context.Agencies.Update(agencyEntity);
                await _context.SaveChangesAsync();

                return await GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la agencia.");
                return new ResponseDto<AgencyDto> { Status = false, Message = "Error al actualizar." };
            }
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var agencyEntity = await _context.Agencies.FindAsync(id);

                if (agencyEntity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Agencia no encontrada.", Data = false };
                }

                // Borrado lógico: desactivamos en lugar de borrar físicamente
                agencyEntity.IsActive = false;
                _context.Agencies.Update(agencyEntity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Agencia desactivada correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la agencia.");
                return new ResponseDto<bool> { Status = false, Message = "Error al eliminar.", Data = false };
            }
        }
    }
}