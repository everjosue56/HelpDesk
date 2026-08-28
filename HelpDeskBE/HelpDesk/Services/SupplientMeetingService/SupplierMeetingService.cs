using AutoMapper;
using HelpDesk.Database;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.SupplierDto;
using HelpDesk.Dtos.SupplierMeetingDto;
using HelpDesk.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HelpDesk.Services.SupplientMeetingService
{
    public class SupplierMeetingService : ISupplierMeetingService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<SupplierMeetingService> _logger;

        public SupplierMeetingService(ApplicationDbContext context, IMapper mapper, ILogger<SupplierMeetingService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PagedResponseDto<SupplierMeetingDto>> GetAllAsync(SupplierMeetingFilterDto filter)
        {
            try
            {
                var query = _context.SupplierMeetingEntities
                    .Include(s => s.Supplier)
                    .OrderByDescending(s => s.CreatedDate)
                    .Where(d => d.IsDeleted == false || d.IsDeleted == null);

                if (!string.IsNullOrWhiteSpace(filter.Description))
                {
 
                    query = query.Where(ss => ss.Description.Contains(filter.Description.Trim()));
                }

                var (entities, totalItems, totalPages) = await query.ToPagedListAsync(filter.PageNumber, filter.PageSize);
                var supplierMeetingDtos = _mapper.Map<IEnumerable<SupplierMeetingDto>>(entities);

                return new PagedResponseDto<SupplierMeetingDto>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Reuniones con proveedores obtenidas correctamente.",
                    Data = supplierMeetingDtos,
                    CurrentPage = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las reuniones con proveedores.");
                return new PagedResponseDto<SupplierMeetingDto>
                {
                    Status = false,
                    StatusCode = 500,
                    Message = "Error interno del servidor al recuperar los datos."
                };
            }
        }

        public async Task<ResponseDto<SupplierMeetingDto>> GetByIdAsync(long id)
        {
            // Se añade filtro para evitar leer registros eliminados
            var supplierMeetingEntity = await _context.SupplierMeetingEntities
               .Include(a => a.Supplier)
               .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

            if (supplierMeetingEntity == null)
            {
                return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "Reunión con proveedor no encontrada." };
            }

            return new ResponseDto<SupplierMeetingDto>
            {
                Status = true,
                Data = _mapper.Map<SupplierMeetingDto>(supplierMeetingEntity)
            };
        }

        public async Task<ResponseDto<SupplierMeetingDto>> CreateAsync(CreateSupplierMeetingDto dto)
        {
            try
            {
                var suppExists = await _context.Suppliers.AnyAsync(o => o.Id == dto.IdSupplier);
                if (!suppExists)
                {
                    return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "El Proveedor especificado no existe." };
                }

                var supplierMeetingEntity = _mapper.Map<SupplierMeetingEntity>(dto);

                await _context.SupplierMeetingEntities.AddAsync(supplierMeetingEntity);
                await _context.SaveChangesAsync();

        
                return await GetByIdAsync(supplierMeetingEntity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la reunión con proveedor.");
                return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "No se pudo crear el registro." };
            }
        }

        public async Task<ResponseDto<SupplierMeetingDto>> UpdateAsync(UpdateSupplierMeetingDto dto, long id)
        {
            try
            {
                var supplierMeetingEntity = await _context.SupplierMeetingEntities
                    .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

                // Validación de existencia indispensable antes de mapear
                if (supplierMeetingEntity == null)
                {
                    return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "Registro no encontrado o ya eliminado." };
                }

                _mapper.Map(dto, supplierMeetingEntity);
                _context.SupplierMeetingEntities.Update(supplierMeetingEntity);
                await _context.SaveChangesAsync();

                return await GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el registro.");
                return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "Error al actualizar." };
            }
        }

        public async Task<ResponseDto<bool>> DeleteAsync(long id)
        {
            try
            {
                var supplierMeetingEntity = await _context.SupplierMeetingEntities
                    .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

                if (supplierMeetingEntity == null)
                {
                    return new ResponseDto<bool> { Status = false, Message = "Registro no encontrado.", Data = false };
                }

                supplierMeetingEntity.IsDeleted = true;
                _context.SupplierMeetingEntities.Update(supplierMeetingEntity);
                await _context.SaveChangesAsync();

                return new ResponseDto<bool> { Status = true, Message = "Registro desactivado correctamente.", Data = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar el registro.");
                return new ResponseDto<bool> { Status = false, Message = "Error al procesar la desactivación.", Data = false };
            }
        }

        public async Task<ResponseDto<SupplierMeetingDto>> UploadEvidenceAsync(long id, IFormFile file)
        {
            try
            {
                // 1. Validar que venga un archivo
                if (file == null || file.Length == 0)
                {
                    return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "No se recibió ningún archivo." };
                }

                if (file.Length > 50 * 1024 * 1024)
                {
                    return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "El archivo no puede superar los 50 MB." };
                }

                // 2. Buscar la reunión en la base de datos
                var meeting = await _context.SupplierMeetingEntities
                    .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

                if (meeting == null)
                {
                    return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "La reunión no existe o fue eliminada." };
                }

                // 3. Crear la ruta donde se guardará el archivo
                // Nota: Es recomendable tener esta ruta base en tu appsettings.json
                string basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "SupplierMeetings");
                string folderPath = Path.Combine(basePath, $"Meeting_{id}");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                // 4. Generar un nombre único para evitar que archivos con el mismo nombre se sobreescriban
                string fileExtension = Path.GetExtension(file.FileName);
                string uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                string fullPath = Path.Combine(folderPath, uniqueFileName);

                // 5. Guardar el archivo en el servidor
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // 6. Actualizar el campo Evidence con la ruta relativa
                meeting.Evidence = Path.Combine($"Meeting_{id}", uniqueFileName).Replace("\\", "/");

                _context.SupplierMeetingEntities.Update(meeting);
                await _context.SaveChangesAsync();

                return new ResponseDto<SupplierMeetingDto>
                {
                    Status = true,
                    Message = "Evidencia adjuntada correctamente.",
                    Data = _mapper.Map<SupplierMeetingDto>(meeting)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al subir la evidencia para la reunión ID: {Id}", id);
                return new ResponseDto<SupplierMeetingDto> { Status = false, Message = "Ocurrió un error al guardar el archivo." };
            }
        }
    }
}
