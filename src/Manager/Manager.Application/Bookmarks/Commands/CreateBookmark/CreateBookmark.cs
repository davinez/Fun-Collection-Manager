using System;
using System.Linq;
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
    private readonly IPlaywrightService _playwrightService;

    public CreateBookmarkCommandHandler(IConfiguration configuration, IUser user, IManagerContext context, IS3StorageService storageService, IPlaywrightService playwrightService)
    {
        _configuration = configuration;
        _user = user;
        _context = context;
        _storageService = storageService;
        _playwrightService = playwrightService;
    }

    public async Task Handle(CreateBookmarkCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections
            .AsNoTracking()
            .Where(c => c.Id == request.CollectionId &&
                        c.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);

        if (_playwrightService.PlaywrightContext == null ||
            _playwrightService.Browser == null)
        {
            throw new ManagerException($"PlaywrightService null property instances in {nameof(CreateBookmarkCommand)}");
        }

        // Create a new incognito browser context.
        await using var bookmarkContext = await _playwrightService.Browser.NewContextAsync();
        // 12 seconds
        bookmarkContext.SetDefaultTimeout(12000);

        IPage page = await bookmarkContext.NewPageAsync();
        IResponse? gotoResponse = await page.GotoAsync(request.NewURL);

        // Handle Go to Page response
        if (gotoResponse == null || !gotoResponse.Ok)
        {
            throw new ManagerException($"Failure in page load specified NewURL in {nameof(CreateBookmarkCommand)}");
        }

        // Cover
        var screenshotBuffer = await page.ScreenshotAsync(new()
        {
            Type = ScreenshotType.Png
        });

        // Keeping size ratio of 16:9
        var (newFileContent, newHeight, newWidth) = ImageHelpers.Resize(screenshotBuffer, 254, 141);

        // Title
        string pageTitle = await GetPageTitleAsync(page);

        // Description
        string? pageDescription = await GetPageDescriptionAsync(page);

        await bookmarkContext.CloseAsync();

        /*
         
        var base64StringOld = Convert.ToBase64String(screenshotBuffer);
        stream.CopyTo(memoryStream);
        byte[] bytes = newFileContent.ToArray();
        return Convert.ToBase64String(bytes);

        */

        // Generate SQL Query with only the 2 specified columns
        int userId = (await _context.UserAccounts
            .AsNoTracking()
            .Select(c => new { c.Id, c.IdentityProviderId})
            .FirstAsync(u => u.IdentityProviderId == _user.HomeAccountId, cancellationToken: cancellationToken))
            .Id;

        string bucketName = _configuration["S3Storage:BookmarksCoversBucket"] ?? throw new ManagerException($"Empty config section in {nameof(CreateBookmark)} bookmarks bucket");
        string objectKey = $"{userId}/{collection.Id}/{Nanoid.Generate("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 12)}";

        await _storageService.UploadImageAsync(bucketName, objectKey, newFileContent);

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

    private static async Task<string> GetPageTitleAsync(IPage page)
    {
        string? title;

        try
        {
            // Try title element 
            ILocator? titleLoc1 = page.Locator("title");
            title = titleLoc1 != null ? await titleLoc1.TextContentAsync() : "";

            // Fallback to og:title if title element is missing
            if (string.IsNullOrWhiteSpace(title))
            {
                ILocator? titleLoc2 = page.Locator("meta[property=\"og:title\"]");
                title = titleLoc2 != null ? await titleLoc2.GetAttributeAsync("content") : "";
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                return title;
            }

        }
        catch (TimeoutException)
        {
            // Default title if both attempts fail
            return "N/A title";
        }

        // Default title if both attempts fail
        return "N/A title";
    }

    private static async Task<string> GetPageDescriptionAsync(IPage page)
    {
        string? description;

        try
        {
            // Try description element 
            ILocator? descriptionLoc1 = page.Locator("meta[name=\"description\"]");
            description = descriptionLoc1 != null ? await descriptionLoc1.GetAttributeAsync("content") : "";

            // Fallback to og:description if title element is missing
            if (string.IsNullOrWhiteSpace(description))
            {
                ILocator? descriptionLoc2 = page.Locator("meta[property=\"og:description\"]");
                description = descriptionLoc2 != null ? await descriptionLoc2.GetAttributeAsync("content") : "";
            }

            if (!string.IsNullOrWhiteSpace(description))
            {
                return description;
            }
        }
        catch (TimeoutException)
        {

            // Default title if both attempts fail
            return "N/A Description";
        }

        // Default title if both attempts fail
        return "N/A Description";
    }
}
