using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Collections.Commands.PatchCollection;

public record PatchCollectionCommand : IRequest
{
    public int CollectionId { get; set; }
    public required string Name { get; init; }

}

public class PatchCollectionCommandHandler : IRequestHandler<PatchCollectionCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;

    public PatchCollectionCommandHandler(IUser user, IManagerContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task Handle(PatchCollectionCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections
            .Where(c => c.Id == request.CollectionId &&
                        c.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);

        collection.Name = request.Name;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

