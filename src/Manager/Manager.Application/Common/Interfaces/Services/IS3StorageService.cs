using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Icons.Dto;

namespace Manager.Application.Common.Interfaces.Services;

public interface IS3StorageService
{
    public Task<IEnumerable<IconDto>> GetAllIconsAsync(CancellationToken cancellationToken);
    public Task UploadImageAsync(string bucketName, string objectKey, string contentType, Stream imageBytes);
}
