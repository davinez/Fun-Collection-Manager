using System;
using System.Collections.Generic;
using System.IO;
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
            ServiceURL = configuration["S3Storage:R2Url"]
        };

        _s3Client = new AmazonS3Client(accessKey, secretKey, config);

        _configuration = configuration;
    }

    public async Task<IEnumerable<IconDto>> GetAllIconsAsync(CancellationToken cancellationToken)
    {
        string bucketName = _configuration["S3Storage:IconsBucket"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} icons bucket");
        string domainURL = _configuration["S3Storage:DomainUrl"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} domain url");

        var listObjectsRequest = new ListObjectsV2Request
        {
            BucketName = bucketName
        };

        ListObjectsV2Response responseClient = await _s3Client.ListObjectsV2Async(listObjectsRequest, cancellationToken) ?? throw new ManagerException($"Null response in ListObjects of {nameof(S3StorageService)} for get all icons");

        var response = responseClient.S3Objects.Select(s3Object => new IconDto() 
        { 
            URL = domainURL + "/" + s3Object.Key 
        });

        return response;
    }

    public async Task UploadImageAsync(string bucketName, string objectKey, Stream imageStream)
    {
        var putObjectRequest = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = objectKey,
            ContentType = "image/webp", // Specify WebP content type
            InputStream = imageStream,
            DisablePayloadSigning = true // https://github.com/cloudflare/cloudflare-docs/issues/4683
        };

        PutObjectResponse response = await _s3Client.PutObjectAsync(putObjectRequest);

        if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
        {
            throw new ManagerException($"Error in uploading image for bucket {bucketName}");
        }
       
    }

}
