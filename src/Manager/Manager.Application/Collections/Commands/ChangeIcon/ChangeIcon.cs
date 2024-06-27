using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Collections.Commands.ChangeIcon;

public record ChangeIconCommand : IRequest
{
    public int CollectionId { get; set; }
    public bool IsDefaultIcon { get; set; }
    public required string IconURL { get; set; }
}

public class ChangeIconCommandHandler : IRequestHandler<ChangeIconCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;

    public ChangeIconCommandHandler(IUser user, IManagerContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task Handle(ChangeIconCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections
            .Where(c => c.Id == request.CollectionId &&
                        c.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);

        collection.Icon = request.IconURL;

        await _context.SaveChangesAsync(cancellationToken);
    }
}


