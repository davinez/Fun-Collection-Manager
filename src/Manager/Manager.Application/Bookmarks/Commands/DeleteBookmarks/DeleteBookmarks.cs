using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Manager.Application.Bookmarks.Commands.DeleteBookmarks;

public record DeleteBookmarksCommand : IRequest
{
    public required int[] BookmarksIds { get; set; }
}

public class DeleteBookmarksCommandHandler : IRequestHandler<DeleteBookmarksCommand>
{
    private readonly IConfiguration _configuration;
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IS3StorageService _storageService;

    public DeleteBookmarksCommandHandler(
        IUser user,
        IManagerContext context,
        IS3StorageService storageService,
        IConfiguration configuration)
    {
        _user = user;
        _context = context;
        _storageService = storageService;
        _configuration = configuration;
    }

    public async Task Handle(DeleteBookmarksCommand request, CancellationToken cancellationToken)
    {
        List<Bookmark>? bookmarks = await _context.Bookmarks
            .Where(c => request.BookmarksIds.Contains(c.Id) &&
                        c.Collection.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            .ToListAsync(cancellationToken);

        Guard.Against.NotFound(string.Join(",", bookmarks), bookmarks);

        string bucketName = _configuration["S3Storage:BucketBookmarksCovers"] ?? throw new ManagerException($"Empty config section in {nameof(CreateBookmark)} bookmarks bucket");

        string[] keysToDelete = bookmarks.Where(p => p.Cover != null).Select(b => b.Cover).ToArray()!;

        // TODO: Manage to send list of success and list of errors in deleting covers
        // Optional: console app to sync database covers and R2 covers (delete in R2 non existen keys in DB)
        string[] keysDeleted = await _storageService.DeleteFilesAsync(bucketName, keysToDelete);

        _context.Bookmarks.RemoveRange(bookmarks);

        await _context.SaveChangesAsync(cancellationToken);
    }
}

