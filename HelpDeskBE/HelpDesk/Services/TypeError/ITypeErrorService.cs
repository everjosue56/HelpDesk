using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.OrganizationsDto;
using HelpDesk.Dtos.TypeErrorDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.TypeError
{
    public interface ITypeErrorService
    {
        Task<ResponseDto<IEnumerable<TypeErrorDto>>> GetAllAsync();
        Task<ResponseDto<TypeErrorDto>> GetByIdAsync(long id);
        Task<ResponseDto<TypeErrorDto>> CreateAsync(CreateTypeErrorDto dto);
        Task<ResponseDto<TypeErrorDto>> UpdateAsync(UpdateTypeErrorDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}
