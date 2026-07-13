using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AlertTypeDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Services.AlertTypeServices;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using HelpDesk.Helpers;

namespace HelpDesk.Services.AlertTypeService
{
    public class AlertTypeService : IAlertTypeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public AlertTypeService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<AlertTypeService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<AlertTypeDto>> GetAllAsync(AlertTypeFilterDto filter)
        {
            try
            {
                var query = _context.AlertsType
                 .AsNoTracking()
                 .Where(at => !at.IsDeleted)
                 .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(at => at.Name.ToLower().Contains(searchTerm));
                }
                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var alertTypesDto = _mapper.Map<IEnumerable<AlertTypeDto>>(entities);

                return new PagedResponseDto<AlertTypeDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Tipos de alertas obtenidos correctamente.",
                    Data = alertTypesDto,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los tipos de alertas.");
                return new PagedResponseDto<AlertTypeDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
        }

        public async Task<ResponseDto<AlertTypeDto>> GetByIdAsync(long id)
        {
            var entity = await _context.AlertsType.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<AlertTypeDto> { Status = false, StatusCode = 404, Message = "El tipo de alerta no existe." };
            }

            return new ResponseDto<AlertTypeDto> { Status = true, StatusCode = 200, Data = _mapper.Map<AlertTypeDto>(entity) };
        }

        public async Task<ResponseDto<AlertTypeDto>> CreateAsync(CreateAlertTypeDto dto)
        {
            // Validar duplicados para evitar nombres repetidos
            var exists = await _context.AlertsType.AnyAsync(a => a.Name.ToLower() == dto.Name.ToLower());
            if (exists)
            {
                return new ResponseDto<AlertTypeDto> { Status = false, StatusCode = 400, Message = $"El tipo de alerta '{dto.Name}' ya existe." };
            }

            var entity = _mapper.Map<AlertTypeEntity>(dto);
            entity.CreatedBy = _authService.GetUserId();
            entity.CreatedDate = DateTime.Now;
            entity.IsDeleted = false;

            _context.AlertsType.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<AlertTypeDto>> UpdateAsync(UpdateAlertTypeDto dto, long id)
        {
            var entity = await _context.AlertsType.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<AlertTypeDto> { Status = false, StatusCode = 404, Message = "Tipo de alerta no encontrado." };
            }

            _mapper.Map(dto, entity);
            entity.UpdatedBy = _authService.GetUserId();
            entity.UpdatedDate = DateTime.Now;

            _context.AlertsType.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.AlertsType.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }
            _context.AlertsType.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}