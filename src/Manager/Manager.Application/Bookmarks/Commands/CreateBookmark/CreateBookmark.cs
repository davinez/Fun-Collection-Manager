using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
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

    public CreateBookmarkCommandHandler(IUser user, IManagerContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task Handle(CreateBookmarkCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections
            .AsNoTracking()
            .Where(c => c.Id == request.CollectionId &&
                        c.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);

        // Add logic

        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.LaunchAsync();
        IPage page = await browser.NewPageAsync();

        await page.GotoAsync("https://es.wikipedia.org/wiki/Wiki");

        // Capture the full page screenshot
        var screenshotBuffer = await page.ScreenshotAsync();

        // Encode the buffer to base64 string
        var base64String = Convert.ToBase64String(screenshotBuffer);

     //   Console.WriteLine(base64String);

        await browser.CloseAsync();

        // await _context.SaveChangesAsync(cancellationToken);
    }
}
