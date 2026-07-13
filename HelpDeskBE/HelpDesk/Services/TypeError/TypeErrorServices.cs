using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.TypeErrorDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.TypeError;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services
{
    public class TypeErrorService : ITypeErrorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;
        public TypeErrorService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<TypeErrorService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<TypeErrorDto>> GetAllAsync(TypeErrorFilterDto filter)
        {
            try
            {
                var query = _context.TypeErrors
                    .Where(te => !te.IsDeleted)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(te => te.Name.ToLower().Contains(searchTerm));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);
                var dtos = _mapper.Map<IEnumerable<TypeErrorDto>>(entities);

                return new PagedResponseDto<TypeErrorDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Tipos de error obtenidos correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los tipos de errores.");
                return new PagedResponseDto<TypeErrorDto> { Status = false, StatusCode = 500, Message = "Error interno del servidor." };
            }
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
            entity.IsDeleted = false;

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
            try
            {
                var entity = await _context.TypeErrors.FindAsync(id);

                if (entity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Error no encontrada.", Data = false };
                }

                entity.IsDeleted = true;

                _context.TypeErrors.Update(entity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Error desactivado correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar tipo de error.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la desactivacion.", Data = false };
            }
        }
    }
}