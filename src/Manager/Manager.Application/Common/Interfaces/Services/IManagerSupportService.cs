using System.Threading.Tasks;
using Manager.Application.Common.Dtos.Services.ManagerSupportService;

namespace Manager.Application.Common.Interfaces.Services;

public interface IManagerSupportService
{
    Task<BookmarkDataDto> GetBookmarkData(string webUrl);
}
