using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Helpers;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Playwright;
using NanoidDotNet;

namespace Manager.Application.Bookmarks.Commands.CreateBookmark;

public record CreateBookmarkCommand : MediatR.IRequest
{
    public int CollectionId { get; set; }
    public required string NewURL { get; set; }
}

public class CreateBookmarkCommandHandler : IRequestHandler<CreateBookmarkCommand>
{
    private readonly IConfiguration _configuration;
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IS3StorageService _storageService;
    private readonly IManagerSupportService _supportservice;

    public CreateBookmarkCommandHandler(
        IConfiguration configuration,
        IUser user,
        IManagerContext context,
        IS3StorageService storageService,
        IManagerSupportService supportservice)
    {
        _configuration = configuration;
        _user = user;
        _context = context;
        _storageService = storageService;
        _supportservice = supportservice;
    }

    public async Task Handle(CreateBookmarkCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections
            .AsNoTracking()
            .Where(c => c.Id == request.CollectionId &&
                        c.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);


        // Cover
        byte[] pageCover = await GetCoverAsync(page);

        // Keeping size ratio of 16:9
        using Stream newFileContent = ImageHelpers.Resize(pageCover, 635, 357);

        // Title
        string pageTitle = await GetPageTitleAsync(page);
        if (pageTitle.Length > 100)
            pageTitle = $"{pageTitle.Substring(0, 97)}...";

        // Description
        string? pageDescription = await GetPageDescriptionAsync(page);
        if (pageDescription.Length > 255)
            pageDescription = $"{pageDescription.Substring(0, 252)}...";

        await bookmarkContext.CloseAsync();

        // Test
        //using (var memoryStream = new MemoryStream())
        //{
        //    newFileContent.CopyTo(memoryStream);
        //    byte[] newfile = memoryStream.ToArray();
        //    string newfileBase64 = Convert.ToBase64String(newfile);
        //}
        //newFileContent.Seek(0, SeekOrigin.Begin);

        // Generate SQL Query with only the 2 specified columns
        int userId = (await _context.UserAccounts
            .AsNoTracking()
            .Select(c => new { c.Id, c.IdentityProviderId })
            .FirstAsync(u => u.IdentityProviderId == _user.HomeAccountId, cancellationToken: cancellationToken))
            .Id;

        string bucketName = _configuration["S3Storage:BucketBookmarksCovers"] ?? throw new ManagerException($"Empty config section in {nameof(CreateBookmark)} bookmarks bucket");
        string objectKey = $"{userId}/{collection.Id}/{Nanoid.Generate("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10)}";

        await _storageService.UploadImageAsync(bucketName, objectKey, "image/webp", newFileContent);

        var newBookmark = new Bookmark()
        {
            Cover = objectKey,
            Title = pageTitle,
            Description = pageDescription,
            WebsiteUrl = request.NewURL,
            CollectionId = collection.Id,
        };

        _context.Bookmarks.Add(newBookmark);

        await _context.SaveChangesAsync(cancellationToken);
    }

}
