using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Helpers;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NanoidDotNet;

namespace Manager.Application.Bookmarks.Commands.PatchBookmark;

public record PatchBookmarkCommand : IRequest
{
    public int BookmarkId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string WebsiteURL { get; set; }
    public IFormFile? Cover { get; set; }
}

public class PatchBookmarkCommandHandler : IRequestHandler<PatchBookmarkCommand>
{
    private readonly IConfiguration _configuration;
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IS3StorageService _storageService;
    private readonly IManagerSupportService _supportservice;
    private readonly IRedisCacheService _cache;

    public PatchBookmarkCommandHandler(
        IConfiguration configuration,
        IUser user,
        IManagerContext context,
        IS3StorageService storageService,
        IManagerSupportService supportservice,
        IRedisCacheService cache)
    {
        _configuration = configuration;
        _user = user;
        _context = context;
        _storageService = storageService;
        _supportservice = supportservice;
        _cache = cache;
    }

    public async Task Handle(PatchBookmarkCommand request, CancellationToken cancellationToken)
    {
        var bookmark = await _context.Bookmarks
           .Where(c => request.BookmarkId == c.Id &&
                       c.Collection.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
           .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.BookmarkId, bookmark);

        // Cover
        string? newObjectKey = null;

        if (request.Cover != null)
        {
            // Keeping size ratio of 16:9
            using Stream newFileContent = ImageHelpers.Resize(await request.Cover.GetBytes(), 635, 357);

            // Testing Purpose
            //using (var memoryStream = new MemoryStream())
            //{
            //    newFileContent.CopyTo(memoryStream);
            //    byte[] newfile = memoryStream.ToArray();
            //    string newfileBase64 = Convert.ToBase64String(newfile);
            //}
            //newFileContent.Seek(0, SeekOrigin.Begin);

            string bucketName = _configuration["S3Storage:BucketBookmarksCovers"] ?? throw new ManagerException($"Empty config section in {nameof(PatchBookmarkCommand)} bookmarks bucket");
            newObjectKey = $"{_user.HomeAccountId}/{bookmark.CollectionId}/{Nanoid.Generate("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 8)}";

            await _storageService.UploadImageAsync(bucketName, newObjectKey, "image/webp", newFileContent);

            // Delete existent cover image
            if (!string.IsNullOrWhiteSpace(bookmark.Cover))
            {
                await _storageService.DeleteFileAsync(bucketName, bookmark.Cover);
            }

        }

        bookmark.Title = request.Title;
        bookmark.Description = request.Description;
        bookmark.WebsiteUrl = request.WebsiteURL;
        bookmark.Cover = newObjectKey;

        await _context.SaveChangesAsync(cancellationToken);

        await _cache.RemoveItem(string.Format(CacheKeys.CollectionGroups, _user.HomeAccountId));
    }

}

