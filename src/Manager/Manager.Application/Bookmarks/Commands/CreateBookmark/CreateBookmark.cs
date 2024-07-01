using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Playwright;

namespace Manager.Application.Bookmarks.Commands.CreateBookmark;

public record CreateBookmarkCommand : MediatR.IRequest
{
    public int CollectionId { get; set; }
    public required string NewURL { get; set; }
}

public class CreateBookmarkCommandHandler : IRequestHandler<CreateBookmarkCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IS3StorageService _storageService;
    private readonly IPlaywrightService _playwrightService;

    public CreateBookmarkCommandHandler(IUser user, IManagerContext context, IS3StorageService storageService, IPlaywrightService playwrightService)
    {
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

        IPage page = await bookmarkContext.NewPageAsync();
        IResponse? gotoResponse = await page.GotoAsync(request.NewURL);

        // Handle Go to Page response
        if(gotoResponse == null || !gotoResponse.Ok)
        {
            throw new ManagerException($"Failure in page load specified NewURL in {nameof(CreateBookmarkCommand)}");
        }

        // Cover
        var screenshotBuffer = await page.ScreenshotAsync(new ()
        {
            Type = ScreenshotType.Png
        });

        // TODO: Optimize image size

        // Title
        string title = (await page
            .Locator("title")
            .AllTextContentsAsync())[0] ?? "N/A Title";

        // Description
        var metaDescription = (await page
            .Locator("meta[name=\"description\"]")
            .AllTextContentsAsync())[0] ?? "N/A Description";

        // WebsiteUrl

      // Encode the buffer to base64 string
      var base64String = Convert.ToBase64String(screenshotBuffer);

        await bookmarkContext.CloseAsync();

        // await _context.SaveChangesAsync(cancellationToken);
    }
}
