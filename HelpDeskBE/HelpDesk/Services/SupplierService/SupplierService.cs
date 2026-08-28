using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.OrganizationsDto;
using HelpDesk.Dtos.SoftwareSystemDto;
using HelpDesk.Dtos.SupplierDto;
using HelpDesk.Helpers;
using HelpDesk.Services.AuthService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.SupplierService
{
    public class SupplierService : ISupplierService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;
        public SupplierService(ApplicationDbContext context, IMapper mapper, IAuthService authService, ILogger<SupplierService> logger)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _logger = logger;
        }

        public async Task<PagedResponseDto<SupplierDto>> GetAllAsync(SupplierFilterDto filter)
        {
            try
            {
                var query = _context.Suppliers
                    .Include(s => s.Organization)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.Contact))
                {
                    string searchTerm = filter.Contact.Trim().ToLower();
                    query = query.Where(ss => ss.Contact.ToLower().Contains(searchTerm));
                }

                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    string searchTerm = filter.Name.Trim().ToLower();
                    query = query.Where(ss => ss.Name.ToLower().Contains(searchTerm));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);

                var supplierDtos = _mapper.Map<IEnumerable<SupplierDto>>(entities);

                return new PagedResponseDto<SupplierDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Proovedores obtenidos correctamente.",
                    Data = supplierDtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los proveedores.");
                return new PagedResponseDto<SupplierDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
        }
        public async Task<ResponseDto<SupplierDto>> GetByIdAsync(long id)
        {
            var supplierEntity = await _context.Suppliers
               .Include(a => a.Organization)
               .FirstOrDefaultAsync(a => a.Id == id);

            if (supplierEntity == null)
            {
                return new ResponseDto<SupplierDto> { Status = false, Message = "El proveedor no existe." };
            }

            return new ResponseDto<SupplierDto>
            {
                Status = true,
                Data = _mapper.Map<SupplierDto>(supplierEntity)
            };
        }


        public async Task<ResponseDto<SupplierDto>> CreateAsync(CreateSupplierDto dto)
        {
            try
            {
                // Validar que la organización exista antes de crear
                var orgExists = await _context.Organizations.AnyAsync(o => o.Id == dto.IdOrganization);
                if (!orgExists)
                {
                    return new ResponseDto<SupplierDto> { Status = false, Message = "La organización especificada no existe." };
                }
                var suppExist = await _context.Suppliers.AnyAsync(s => s.Name == dto.Name);
                if (suppExist) 
                { 
                    return new ResponseDto<SupplierDto> { Status = false, Message = "El nombre de proveedor ya existe."};
                }

                var supplierEntity = _mapper.Map<SupplierEntity>(dto);

                await _context.Suppliers.AddAsync(supplierEntity);
                await _context.SaveChangesAsync();

                // Recargamos para incluir la organización en la respuesta
                return await GetByIdAsync(supplierEntity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el proveedor.");
                return new ResponseDto<SupplierDto> { Status = false, Message = "No se pudo crear el proveedor." };
            }
        }
        public async Task<ResponseDto<SupplierDto>> UpdateAsync(UpdateSupplierDto dto, long id)
        {
            try
            {
                var supplierEntity = await _context.Suppliers.FindAsync(id);

                // Usamos AutoMapper para actualizar la entidad existente
                _mapper.Map(dto, supplierEntity);

                _context.Suppliers.Update(supplierEntity);
                await _context.SaveChangesAsync();

                return await GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el proveedor.");
                return new ResponseDto<SupplierDto> { Status = false, Message = "Error al actualizar." };
            }
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var supplierEntity = await _context.Suppliers.FindAsync(id);

                if (supplierEntity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Proveedor no encontrada.", Data = false };
                }

                supplierEntity.IsDeleted = true;
                supplierEntity.IsActive = false;

                _context.Suppliers.Update(supplierEntity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Proveedor desactivado correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar proveedor.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la desactivacion.", Data = false };
            }
        }
       
    }
}
