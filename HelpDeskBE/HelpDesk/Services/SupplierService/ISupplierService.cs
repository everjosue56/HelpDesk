using HelpDesk.Dtos.Common;
using HelpDesk.Dtos.FiltersDto;
using HelpDesk.Dtos.SolutionStateDto;
using HelpDesk.Dtos.SupplierDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HelpDesk.Services.SupplierService
{
    public interface ISupplierService
    {
        Task<PagedResponseDto<SupplierDto>> GetAllAsync(SupplierFilterDto filter);
        Task<ResponseDto<SupplierDto>> GetByIdAsync(long id);
        Task<ResponseDto<SupplierDto>> CreateAsync(CreateSupplierDto dto);
        Task<ResponseDto<SupplierDto>> UpdateAsync(UpdateSupplierDto dto, long id);
        Task<ResponseDto<bool>> DeleteAsync(long id);
    }
}

