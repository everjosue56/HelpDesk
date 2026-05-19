using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.MaintenanceHistoryDto;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.MaintenancesHistoryService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.MaintenanceHistoryService
{
    public class MaintenanceHistoryService : IMaintenancesHistoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public MaintenanceHistoryService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ResponseDto<IEnumerable<MaintenanceHistoryDto>>> GetAllAsync()
        {
            var entities = await _context.MaintenanceHistories
                .Include(mh => mh.Maintenances)
                .Include(mh => mh.Users)
                .Include(mh => mh.Devices)
                    .ThenInclude(d => d.TypeDevices)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<MaintenanceHistoryDto>>(entities);

            return new ResponseDto<IEnumerable<MaintenanceHistoryDto>>
            {
                Status = true,
                StatusCode = 200,
                Data = dtos
            };
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