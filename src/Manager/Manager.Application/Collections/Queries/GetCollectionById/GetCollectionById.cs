using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Collections.Queries.GetCollectionById;

public record GetCollectionByIdQuery : IRequest<CollectionDto>
{
    public int Id { get; init; }
}

public class GetCollectionByIdQueryHandler : IRequestHandler<GetCollectionByIdQuery, CollectionDto>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;

    public GetCollectionByIdQueryHandler(IUser user, IManagerContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task<CollectionDto> Handle(GetCollectionByIdQuery request, CancellationToken cancellationToken)
    {
        CollectionDto searchedCollection = await _context.Collections
            .Where(c => c.Id == request.Id && c.CollectionGroup.UserAccount.IdentityProviderId == _user.HomeAccountId)
            // Subquery
            .Select(c => new CollectionDto()
            {
                Id = c.Id,
                Name = c.Name,
                HasBookmarks = c.Bookmarks.Count != 0,
                HasCollections = c.ChildCollections.Count != 0
            })
            .AsNoTracking()
            .FirstAsync(cancellationToken);

        return searchedCollection;
    }
}
