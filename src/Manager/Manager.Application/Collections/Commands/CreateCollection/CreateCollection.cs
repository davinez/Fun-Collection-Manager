using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Constants;
using Manager.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Collections.Commands.CreateCollection;

public record CreateCollectionCommand : IRequest
{
    public required string Name { get; init; }
    public string? Icon { get; init; }
    public int GroupId { get; init; }
    public int? ParentCollectionId { get; init; }

}

public class CreateCollectionCommandHandler : IRequestHandler<CreateCollectionCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IRedisCacheService _cache;

    public CreateCollectionCommandHandler(IUser user, IManagerContext context, IRedisCacheService cache)
    {
        _user = user;
        _context = context;
        _cache = cache;
    }

    public async Task Handle(CreateCollectionCommand request, CancellationToken cancellationToken)
    {
        // Prevent Id manipulation
        var group = await _context.CollectionGroups
          .AsNoTracking()
          .Where(g => g.Id == request.GroupId &&
                      g.UserAccount.IdentityProviderId == _user.HomeAccountId)
          .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.GroupId, group);

        var newCollection = new Collection()
        {
            Name = request.Name,
            CollectionGroupId = group.Id,
            ParentNodeId = request.ParentCollectionId,
        };

        _context.Collections.Add(newCollection);

        await _context.SaveChangesAsync(cancellationToken);

        await _cache.RemoveItem(string.Format(CacheKeys.CollectionGroups, _user.HomeAccountId));

    }
}
