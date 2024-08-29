using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.CollectionGroups.Commands.DeleteCollectionGroup;

public record DeleteCollectionGroupCommand : IRequest
{
    public int GroupId { get; set; }
}


public class DeleteCollectionGroupCommandHandler : IRequestHandler<DeleteCollectionGroupCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IRedisCacheService _cache;

    public DeleteCollectionGroupCommandHandler(IUser user, IManagerContext context, IRedisCacheService cache)
    {
        _user = user;
        _context = context;
        _cache = cache;
    }

    public async Task Handle(DeleteCollectionGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.CollectionGroups
          .AsNoTracking()
          .Where(g => g.Id == request.GroupId &&
                      g.UserAccount.IdentityProviderId == _user.HomeAccountId)
          .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.GroupId, group);

        _context.CollectionGroups.Remove(group);

        await _context.SaveChangesAsync(cancellationToken);

        await _cache.RemoveItem(string.Format(CacheKeys.CollectionGroups, _user.HomeAccountId));
    }
}

