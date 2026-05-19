using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.SoftwareSystemDto;
using HelpDesk.Dtos.TypeErrorDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.SoftwareSystemServices
{
    public interface ISoftwareSystemService
    {
        Task<ResponseDto<IEnumerable<SoftwareSystemDto>>> GetAllAsync();
        Task<ResponseDto<SoftwareSystemDto>> GetByIdAsync(long id);
        Task<ResponseDto<SoftwareSystemDto>> CreateAsync(CreateSoftwareSystemDto dto);
        Task<ResponseDto<SoftwareSystemDto>> UpdateAsync(UpdateSoftwareSystemDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
