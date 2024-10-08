﻿using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.CollectionGroups.Queries.GetCollectionGroupById;

public record GetCollectionGroupByIdQuery : IRequest<CollectionGroupDto>
{
    public int Id { get; init; }
}

public class GetCollectionGroupByIdQueryHandler : IRequestHandler<GetCollectionGroupByIdQuery, CollectionGroupDto>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;

    public GetCollectionGroupByIdQueryHandler(IUser user, IManagerContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task<CollectionGroupDto> Handle(GetCollectionGroupByIdQuery request, CancellationToken cancellationToken)
    {
        CollectionGroupDto searchedGroup = await _context.CollectionGroups
            .Where(g => g.Id == request.Id && g.UserAccount.IdentityProviderId == _user.HomeAccountId)
             // Subquery
            .Select(g => new CollectionGroupDto()
                        {
                            Id = g.Id,
                            Name = g.Name,
                            HasCollections = g.Collections.Count != 0
            })  
            .AsNoTracking()
            .FirstAsync(cancellationToken);

        return searchedGroup;
    }
}

