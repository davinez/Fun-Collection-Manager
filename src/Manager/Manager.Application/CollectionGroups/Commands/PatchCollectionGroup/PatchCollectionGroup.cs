﻿using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.CollectionGroups.Commands.PatchCollectionGroup;

public record PatchCollectionGroupCommand : IRequest
{
    public int GroupId { get; set; }
    public required string GroupName { get; set; }

}

public class PatchCollectionGroupHandler : IRequestHandler<PatchCollectionGroupCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;
    private readonly IRedisCacheService _cache;

    public PatchCollectionGroupHandler(IUser user, IManagerContext context, IRedisCacheService cache)
    {
        _user = user;
        _context = context;
        _cache = cache;
    }

    public async Task Handle(PatchCollectionGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.CollectionGroups
           .Where(g => g.Id == request.GroupId &&
                       g.UserAccount.IdentityProviderId == _user.HomeAccountId)
           .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.GroupId, group);

        group.Name = request.GroupName;

        await _context.SaveChangesAsync(cancellationToken);

        await _cache.RemoveItem(string.Format(CacheKeys.CollectionGroups, _user.HomeAccountId));
    }
}

