using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Collections.Commands.ChangeIcon;

public record ChangeIconCommand : IRequest
{
    public int CollectionId { get; set; }
    public bool IsDefaultIcon { get; set; }
    public string? IconKey { get; set; }
}

public class ChangeIconCommandHandler : IRequestHandler<ChangeIconCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IRedisCacheService _cache;

    public ChangeIconCommandHandler(IUser user, IManagerContext context, IRedisCacheService cache)
    {
        _user = user;
        _context = context;
        _cache = cache;
    }

    public async Task Handle(ChangeIconCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections
            .Where(c => c.Id == request.CollectionId &&
                        c.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);

        collection.Icon = request.IconKey;

        await _context.SaveChangesAsync(cancellationToken);

        await _cache.RemoveItem(string.Format(CacheKeys.CollectionGroups, _user.HomeAccountId));
    }
}


