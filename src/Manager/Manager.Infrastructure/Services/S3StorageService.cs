using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces.Services;
using Manager.Application.Icons.Dto;
using Microsoft.Extensions.Configuration;

namespace Manager.Infrastructure.Services;

public class S3StorageService : IS3StorageService
{
    private readonly AmazonS3Client _s3Client;
    private readonly IConfiguration _configuration;

    public S3StorageService(IConfiguration configuration)
    {
        string accessKey = configuration["S3Storage:R2Key"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} acces key");
        string secretKey = configuration["S3Storage:R2Secret"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} secret key");

        AmazonS3Config config = new()
        {
            ServiceURL = "https://nyc3.digitaloceanspaces.com"
        };

        _s3Client = new AmazonS3Client(accessKey, secretKey, config);

        _configuration = configuration;
    }

    public async Task<IEnumerable<IconDto>> GetAllIcons(CancellationToken cancellationToken)
    {
        string bucketName = _configuration["S3Storage:IconsBucket"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} icons bucket");

        var listObjectsRequest = new ListObjectsRequest
        {
            BucketName = bucketName
        };

        ListObjectsResponse responseClient = await _s3Client.ListObjectsAsync(listObjectsRequest, cancellationToken) ?? throw new ManagerException($"Null response in ListObjects of {nameof(S3StorageService)} for get all icons");

        var response = responseClient.S3Objects.Select(s3Object => new IconDto() { Name = s3Object.Key });

        //foreach (var s3Object in response.S3Objects)
        //{
        //    if (s3Object.Key.ToLower().EndsWith(".png"))
        //    {
        //        Console.WriteLine($"Object key: {s3Object.Key}");
        //    }
        //}

        return response;
    }


}
