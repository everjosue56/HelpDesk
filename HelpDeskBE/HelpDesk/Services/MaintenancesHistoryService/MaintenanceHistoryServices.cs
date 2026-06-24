using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.MaintenanceHistoryDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.MaintenancesHistoryService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;
using HelpDesk.Helpers;

namespace HelpDesk.Services.MaintenanceHistoryService
{
    public class MaintenanceHistoryService : IMaintenancesHistoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public MaintenanceHistoryService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<MaintenanceHistoryService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<MaintenanceHistoryDto>> GetAllAsync(MaintenanceHistoryFilterDto filter)
        {
            try
            {
                var query = _context.MaintenanceHistories
                    .Include(mh => mh.Maintenances)
                        .ThenInclude(m => m.TypeMaintenance)
                    .Include(mh => mh.Devices)
                    .Include(mh => mh.Users)
                    .Include(mh => mh.DevicesType)
                    .OrderByDescending(mh => mh.CreatedDate)
                    .AsQueryable();

                if (filter.IdMaintenance.HasValue)
                {
                    query = query.Where(mh => mh.IdMaintenance == filter.IdMaintenance.Value);
                }

                if (filter.IdDevice.HasValue)
                {
                    query = query.Where(mh => mh.IdDevice == filter.IdDevice.Value);
                }

                if (filter.IdUser.HasValue)
                {
                    query = query.Where(mh => mh.IdUser == filter.IdUser.Value);
                }

                if (filter.IdTypeDevice.HasValue)
                {
                    query = query.Where(mh => mh.IdTypeDevice == filter.IdTypeDevice.Value);
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var dtos = _mapper.Map<IEnumerable<MaintenanceHistoryDto>>(entities);

 
                return new PagedResponseDto<MaintenanceHistoryDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Historial de mantenimientos obtenido correctamente.",
                    Data = dtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el historial de mantenimientos.");
                return new PagedResponseDto<MaintenanceHistoryDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar el historial."
                };
            }
        }

        public async Task<ResponseDto<MaintenanceHistoryDto>> GetByIdAsync(long id)
        {
            var entity = await _context.MaintenanceHistories
                .Include(mh => mh.Maintenances)
                .Include(mh => mh.Users)
                .Include(mh => mh.Devices)
                    .ThenInclude(d => d.TypeDevices)
                .FirstOrDefaultAsync(mh => mh.Id == id);

            if (entity == null)
            {
                return new ResponseDto<MaintenanceHistoryDto>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "El registro de historial solicitado no existe."
                };
            }

            return new ResponseDto<MaintenanceHistoryDto>
            {
                Status = true,
                StatusCode = 200,
                Data = _mapper.Map<MaintenanceHistoryDto>(entity)
            };
        }

        public async Task<ResponseDto<MaintenanceHistoryDto>> CreateAsync(CreateMaintenanceHistoryDto dto)
        {
            var entity = _mapper.Map<MaintenanceHistoryEntity>(dto);

            entity.CreatedBy = _authService.GetUserId();
            entity.CreatedDate = DateTime.Now;

            _context.MaintenanceHistories.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<MaintenanceHistoryDto>> UpdateAsync(UpdateMaintenanceHistoryDto dto, long id)
        {
            var entity = await _context.MaintenanceHistories.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<MaintenanceHistoryDto> { Status = false, StatusCode = 404 };
            }

            _mapper.Map(dto, entity);

            entity.UpdatedBy = _authService.GetUserId();
            entity.UpdatedDate = DateTime.Now;

            _context.MaintenanceHistories.Update(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            var entity = await _context.MaintenanceHistories.FindAsync(id);

            if (entity == null)
            {
                return new ResponseDto<bool> { Status = false, StatusCode = 404, Data = false };
            }

            _context.MaintenanceHistories.Remove(entity);
            await _context.SaveChangesAsync();

            return new ResponseDto<bool> { Status = true, StatusCode = 200, Data = true };
        }
    }
}