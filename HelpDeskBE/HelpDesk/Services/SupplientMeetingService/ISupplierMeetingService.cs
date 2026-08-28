using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.SupplierDto;
using HelpDesk.Dtos.SupplierMeetingDto;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace HelpDesk.Services.SupplientMeetingService
{
    public interface ISupplierMeetingService
    {
        Task<PagedResponseDto<SupplierMeetingDto>> GetAllAsync(SupplierMeetingFilterDto filter);
        Task<ResponseDto<SupplierMeetingDto>> GetByIdAsync(long id);
        Task<ResponseDto<SupplierMeetingDto>> CreateAsync(CreateSupplierMeetingDto dto);
        Task<ResponseDto<SupplierMeetingDto>> UpdateAsync(UpdateSupplierMeetingDto dto, long id);
        Task<ResponseDto<SupplierMeetingDto>> UploadEvidenceAsync(long id, IFormFile file);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
