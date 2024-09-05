﻿using System.Collections.Generic;
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
    private readonly IConfiguration _configuration;

    public S3StorageService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<IEnumerable<IconDto>> GetAllIconsAsync(CancellationToken cancellationToken)
    {
        string bucketName = _configuration["S3Storage:BucketIcons"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} icons bucket");

        using AmazonS3Client s3Client = GenerateS3Client(bucketName) ?? throw new ManagerException($"Empty s3 client in {nameof(S3StorageService)}");

        var listObjectsRequest = new ListObjectsV2Request
        {
            BucketName = bucketName
        };

        ListObjectsV2Response responseClient = await s3Client.ListObjectsV2Async(listObjectsRequest, cancellationToken) ?? throw new ManagerException($"Null response in ListObjects of {nameof(S3StorageService)} for get all icons");

        var response = responseClient.S3Objects.Select(s3Object => new IconDto()
        {
            Key = s3Object.Key
        });

        return response;
    }

    public async Task UploadImageAsync(string bucketName, string objectKey, string contentType, Stream imageStream)
    {
        using AmazonS3Client s3Client = GenerateS3Client(bucketName) ?? throw new ManagerException($"Empty s3 client in {nameof(S3StorageService)}");

        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = objectKey,
            ContentType = contentType,
            InputStream = imageStream,
            DisablePayloadSigning = true // https://github.com/cloudflare/cloudflare-docs/issues/4683
        };

        PutObjectResponse response = await s3Client.PutObjectAsync(request);

        if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
        {
            throw new ManagerException($"Error in uploading image for bucket {bucketName}");
        }

    }

    public async Task<string> DeleteFileAsync(string bucketName, string objectKey)
    {
        using AmazonS3Client s3Client = GenerateS3Client(bucketName) ?? throw new ManagerException($"Empty s3 client in {nameof(S3StorageService)}");

        var request = new DeleteObjectRequest
        {
            BucketName = bucketName,
            Key = objectKey
        };

        DeleteObjectResponse response = await s3Client.DeleteObjectAsync(request);

        return response.DeleteMarker;
    }

    public async Task<string[]> DeleteFilesAsync(string bucketName, string[] objectKeys)
    {
        using AmazonS3Client s3Client = GenerateS3Client(bucketName) ?? throw new ManagerException($"Empty s3 client in {nameof(S3StorageService)}");

        var request = new DeleteObjectsRequest
        {
            BucketName = bucketName,
        };

        var keys = new List<KeyVersion>();

        foreach (string key in objectKeys)
        {
            keys.Add(new KeyVersion()
            {
                Key = key,
            });
        }

        request.Objects = keys;

        DeleteObjectsResponse response = await s3Client.DeleteObjectsAsync(request);

        return response.DeletedObjects.Select(o => o.Key).ToArray();
    }

    private AmazonS3Client GenerateS3Client(string bucketName)
    {
        AmazonS3Config config = new()
        {
            ServiceURL = _configuration["S3Storage:R2DomainService"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} R2DefaultDomain")
        };

        if (bucketName == _configuration["S3Storage:BucketIcons"])
        {
            string accessKey = _configuration["S3Storage:R2KeyIcons"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} acces key icons");
            string secretKey = _configuration["S3Storage:R2SecretIcons"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} secret key icons");

            return new AmazonS3Client(accessKey, secretKey, config);
        }
        else if (bucketName == _configuration["S3Storage:BucketBookmarksCovers"])
        {
            string accessKey = _configuration["S3Storage:R2KeyBookmarksCovers"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} acces key bookmarkscovers");
            string secretKey = _configuration["S3Storage:R2SecretBookmarksCovers"] ?? throw new ManagerException($"Empty config section in {nameof(S3StorageService)} secret key bookmarkscovers");

            return new AmazonS3Client(accessKey, secretKey, config);
        }

        return new AmazonS3Client();
    }

}
