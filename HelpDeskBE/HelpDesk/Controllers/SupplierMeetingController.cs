using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.SupplierDto;
using HelpDesk.Dtos.SupplierMeetingDto;
using HelpDesk.Services.SupplientMeetingService;
using HelpDesk.Services.SupplierService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;
using System.Threading.Tasks;

namespace HelpDesk.Controllers
{
    [Route("api/supplier_meeting")]
    [ApiController]
    [Authorize(Roles = "Administrador,TI")]
    public class SupplierMeetingController : ControllerBase
    {
        private readonly ISupplierMeetingService _supplientMeetingService;

        public SupplierMeetingController(ISupplierMeetingService supplientMeetingService)
        {
            _supplientMeetingService = supplientMeetingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SupplierMeetingFilterDto filter)
        {
            var response = await _supplientMeetingService.GetAllAsync(filter);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(long id)
        {
            var response = await _supplientMeetingService.GetByIdAsync(id);
            return response.Status ? Ok(response) : NotFound(response);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateSupplierMeetingDto dto)
        {
            var response = await _supplientMeetingService.CreateAsync(dto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromBody] UpdateSupplierMeetingDto dto, long id)
        {
            var response = await _supplientMeetingService.UpdateAsync(dto, id);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var response = await _supplientMeetingService.DeleteAsync(id);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPost("{id}/upload-evidence")]
        [RequestSizeLimit(55 * 1024 * 1024)]
        public async Task<IActionResult> UploadEvidence(long id, IFormFile file)
        {
            var response = await _supplientMeetingService.UploadEvidenceAsync(id, file);

            if (!response.Status)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("{id}/download-evidence")]
        public async Task<IActionResult> DownloadEvidence(long id)
        {
            // 1. Buscamos la reunión
            var response = await _supplientMeetingService.GetByIdAsync(id);

            if (!response.Status || response.Data == null)
                return NotFound("Reunión no encontrada.");

            if (string.IsNullOrEmpty(response.Data.Evidence))
                return NotFound("Esta reunión no tiene ninguna evidencia adjunta.");

            // 2. Construimos la ruta física al archivo
            // Asegúrate de que esta ruta base coincida exactamente con la que usaste al guardar
            string basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "SupplierMeetings");
            string fullPath = Path.Combine(basePath, response.Data.Evidence);

            if (!System.IO.File.Exists(fullPath))
                return NotFound("El archivo físico no se encontró en el servidor.");

            // 3. Detectar el tipo de archivo (MIME type) dinámicamente
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fullPath, out var contentType))
            {
                // Si no sabe qué es, lo manda como archivo genérico
                contentType = "application/octet-stream";
            }

            // 4. Devolver el archivo
            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);

            // Si usas "File()", el navegador intentará abrirlo (ideal para PDFs e imágenes)
            return File(fileBytes, contentType, Path.GetFileName(fullPath));
        }
    }
}
