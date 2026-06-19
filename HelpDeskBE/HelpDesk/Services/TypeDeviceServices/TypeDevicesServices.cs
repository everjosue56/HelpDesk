using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TypeDevicesDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TypeDeviceServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeDeviceService
{
    public class TypeDeviceService : ITypeDevicesService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public TypeDeviceService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<TypeDeviceService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<TypeDevicesDto>> GetAllAsync(TypeDeviceFilterDto filter)
        {
            try
            {
                var query = _context.TypeDevices
                    .Where(x => !x.IsDeleted)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(td => td.Name.ToLower().Contains(searchTerm));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);


                var typeDevicesDto = _mapper.Map<IEnumerable<TypeDevicesDto>>(entities);

                return new PagedResponseDto<TypeDevicesDto >
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Tipos de dispositivo obtenidos correctamente.",
                    Data = typeDevicesDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los tipos de dispositivos.");
                return new PagedResponseDto<TypeDevicesDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
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
            try
            {
                var typeDevicesDto = await _context.TypeDevices.FindAsync(id);

                if (typeDevicesDto == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Tipo de dispositivo no encontrada.", Data = false };
                }

                typeDevicesDto.IsDeleted = true;

                _context.TypeDevices.Update(typeDevicesDto);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Tipo de dispositivo desactivada correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar tipo de dispositivo.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la desactivacion.", Data = false };
            }
        }
    }
}