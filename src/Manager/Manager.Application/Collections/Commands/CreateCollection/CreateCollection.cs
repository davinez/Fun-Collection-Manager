using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Collections.Commands.CreateCollection;

public record CreateCollectionCommand : IRequest<Unit>
{
    public required string Name { get; init; }
    public required string Icon { get; init; }
    public int GroupId { get; init; }
    public int? ParentCollectionId { get; init; }

}

public class CreateCollectionCommandHandler : IRequestHandler<CreateCollectionCommand, Unit>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;

    public CreateCollectionCommandHandler(IUser user, IManagerContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task<Unit> Handle(CreateCollectionCommand request, CancellationToken cancellationToken)
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
            Icon = request.Icon,
            CollectionGroupId = group.Id,
            ParentNodeId = request.ParentCollectionId,
        };

        _context.Collections.Add(newCollection);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
