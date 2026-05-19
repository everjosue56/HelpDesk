using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace HelpDesk.Services.AreaServices
{
    public class AreaService : IAreaService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<AreaService> _logger;

        public AreaService(ApplicationDbContext context, IMapper mapper, ILogger<AreaService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ResponseDto<IEnumerable<AreaDto>>> GetAllAsync()
        {
            try
            {
                var areasEntity = await _context.Areas
                    .Include(a => a.Agencies) 
                    .Where(a => a.IsActive)
                    .ToListAsync();

                var areasDto = _mapper.Map<IEnumerable<AreaDto>>(areasEntity);

                return new ResponseDto<IEnumerable<AreaDto>>
                {
                    Status = true,
                    Data = areasDto,
                    Message = "Listado de áreas obtenido correctamente."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener áreas.");
                return new ResponseDto<IEnumerable<AreaDto>> { Status = false, Message = "Error al recuperar los datos." };
            }
        }

        public async Task<ResponseDto<AreaDto>> GetByIdAsync(long id)
        {
            var areaEntity = await _context.Areas
                .Include(a => a.Agencies)
                .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);

            if (areaEntity == null)
            {
                return new ResponseDto<AreaDto> { Status = false, Message = "El área no existe." };
            }

            return new ResponseDto<AreaDto>
            {
                Status = true,
                Data = _mapper.Map<AreaDto>(areaEntity)
            };
        }

        public async Task<ResponseDto<AreaDto>> CreateAsync(CreateAreaDto dto)
        {
            try
            {
                // Validamos que la agencia exista
                var agencyExists = await _context.Agencies.AnyAsync(a => a.Id == dto.IdAgency);
                if (!agencyExists)
                {
                    return new ResponseDto<AreaDto> { Status = false, Message = "La agencia especificada no existe." };
                }

                var areaEntity = _mapper.Map<AreaEntity>(dto);

                _context.Areas.Add(areaEntity);
                await _context.SaveChangesAsync();

                // Retornamos el DTO completo (incluyendo el nombre de la agencia)
                return await GetByIdAsync(areaEntity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear área.");
                return new ResponseDto<AreaDto> { Status = false, Message = "No se pudo crear el área." };
            }
        }

        public async Task<ResponseDto<AreaDto>> UpdateAsync(UpdateAreaDto dto, long id)
        {
            try
            {
                var areaEntity = await _context.Areas.FindAsync(id);

                if (areaEntity == null || !areaEntity.IsActive)
                {
                    return new ResponseDto<AreaDto> { Status = false, Message = "Área no encontrada." };
                }

                // Si se intenta cambiar de agencia, validamos que la nueva exista
                if (dto.IdAgency != areaEntity.IdAgency)
                {
                    var agencyExists = await _context.Agencies.AnyAsync(a => a.Id == dto.IdAgency);
                    if (!agencyExists)
                    {
                        return new ResponseDto<AreaDto> { Status = false, Message = "La nueva agencia no es válida." };
                    }
                }

                _mapper.Map(dto, areaEntity);
                _context.Areas.Update(areaEntity);
                await _context.SaveChangesAsync();

                return await GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar área.");
                return new ResponseDto<AreaDto> { Status = false, Message = "Error al actualizar los datos." };
            }
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var areaEntity = await _context.Areas.FindAsync(id);

                if (areaEntity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Área no encontrada.", Data = false };
                }

                // Borrado lógico para mantener integridad con usuarios y tickets
                areaEntity.IsActive = false;
                _context.Areas.Update(areaEntity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Área desactivada correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar área.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la eliminación.", Data = false };
            }
        }
    }
}