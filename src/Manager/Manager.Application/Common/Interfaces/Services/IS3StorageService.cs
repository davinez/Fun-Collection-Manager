using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Icons.Dto;

namespace Manager.Application.Common.Interfaces.Services;

public interface IS3StorageService
{
    public Task<IEnumerable<IconDto>> GetAllIcons(CancellationToken cancellationToken);
}
