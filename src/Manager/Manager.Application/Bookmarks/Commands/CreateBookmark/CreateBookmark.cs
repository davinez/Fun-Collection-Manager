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
    private readonly IPlaywrightService _playwrightService;
    private readonly IHttpClientFactory _httpClientFactory;

    public CreateBookmarkCommandHandler(
        IConfiguration configuration,
        IUser user,
        IManagerContext context,
        IS3StorageService storageService,
        IPlaywrightService playwrightService,
        IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _user = user;
        _context = context;
        _storageService = storageService;
        _playwrightService = playwrightService;
        _httpClientFactory = httpClientFactory;
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
        bookmarkContext.SetDefaultTimeout(0);

        IPage page = await bookmarkContext.NewPageAsync();
        IResponse? gotoResponse = await page.GotoAsync(request.NewURL);

        // Handle Go to Page response
        if (gotoResponse == null || !gotoResponse.Ok)
        {
            throw new ManagerException($"Failure in page load specified NewURL in {nameof(CreateBookmarkCommand)}");
        }

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

    private async Task<byte[]> GetCoverAsync(IPage page)
    {
        ILocator locator1 = page.Locator("meta[property=\"og:image\"]");

        string imageURL = await RetrieveAttributeValueAsync(locator1, string.Empty, "content");

        if (!string.IsNullOrWhiteSpace(imageURL) &&
            Uri.TryCreate(imageURL, UriKind.Absolute, out var uriResult) &&
                    (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
        {

            HttpClient client = _httpClientFactory.CreateClient();
            HttpResponseMessage? imageResponse = await client.GetAsync(uriResult);

            if (imageResponse != null && imageResponse.IsSuccessStatusCode)
            {
                return await imageResponse.Content.ReadAsByteArrayAsync();

                // Test
                //var s = await imageResponse.Content.ReadAsByteArrayAsync();
                //string newfileBase64 = Convert.ToBase64String(s);
                //return s;
            }

        }

        byte[] screenshot = await page.ScreenshotAsync(new()
        {
            Type = ScreenshotType.Png
        });

        return screenshot;
    }

    private static async Task<string> GetPageTitleAsync(IPage page)
    {
        ILocator locator1 = page.Locator("title");
        ILocator locator2 = page.Locator("meta[property=\"og:title\"]");

        string title = await RetrieveTextContentValueAsync(locator1, string.Empty);

        if (string.IsNullOrWhiteSpace(title))
            title = await RetrieveAttributeValueAsync(locator2, "N/A Title", "content");

        return title;
    }

    private static async Task<string> GetPageDescriptionAsync(IPage page)
    {
        ILocator locator1 = page.Locator("meta[name=\"description\"]");
        ILocator locator2 = page.Locator("meta[property=\"og:description\"]");

        string description = await RetrieveAttributeValueAsync(locator1, string.Empty, "content");

        if (string.IsNullOrWhiteSpace(description))
            description = await RetrieveAttributeValueAsync(locator2, "N/A Description", "content");

        return description;
    }

    private static async Task<string> RetrieveTextContentValueAsync(
        ILocator locator,
        string defaultValue,
        WaitForSelectorState state = WaitForSelectorState.Attached,
        int timeOut = 0)
    {
        try
        {
            int locatorsCount = await locator.CountAsync();

            if (locatorsCount > 1)
            {
                locator = locator.First;
                await locator.WaitForAsync(new() { State = state, Timeout = timeOut });
            }
            else if (locatorsCount == 1)
            {
                await locator.WaitForAsync(new() { State = state, Timeout = timeOut });
            }
            else
            {
                return defaultValue;
            }

            string? value = await locator.TextContentAsync(new() { Timeout = timeOut });

            return string.IsNullOrWhiteSpace(value) ? defaultValue : value;
        }
        catch (Exception)
        {
            return defaultValue;
        }
    }

    private static async Task<string> RetrieveAttributeValueAsync(
        ILocator locator,
        string defaultValue,
        string attributeName,
        WaitForSelectorState state = WaitForSelectorState.Attached,
        int timeOut = 0)
    {
        try
        {
            int locatorsCount = await locator.CountAsync();

            if (locatorsCount > 1)
            {
                locator = locator.First;
                await locator.WaitForAsync(new() { State = state, Timeout = timeOut });
            }
            else if (locatorsCount == 1)
            {
                await locator.WaitForAsync(new() { State = state, Timeout = timeOut });
            }
            else
            {
                return defaultValue;
            }

            string? value = await locator.GetAttributeAsync(attributeName, new() { Timeout = timeOut });

            return string.IsNullOrWhiteSpace(value) ? defaultValue : value;
        }
        catch (Exception)
        {
            return defaultValue;
        }
    }

}
