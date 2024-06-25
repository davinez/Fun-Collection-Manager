using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.CollectionGroups.Commands.CreateCollectionGroup;

public record CreateCollectionGroupCommand : IRequest
{
    public string? GroupName { get; init; }
}

public class CreateCollectionGroupCommandHandler : IRequestHandler<CreateCollectionGroupCommand>
{
    private readonly IUser _user;
    private readonly IManagerContext _context;

    public CreateCollectionGroupCommandHandler(IUser user, IManagerContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task Handle(CreateCollectionGroupCommand request, CancellationToken cancellationToken)
    {
        var userAccount = await _context.UserAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.IdentityProviderId.Equals(_user.HomeAccountId));

        Guard.Against.NotFound(_user.HomeAccountId, userAccount);

        var entity = new CollectionGroup
        {
            Name = request.GroupName,
            UserAccountId = userAccount.Id,
        };

        _context.CollectionGroups.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);
     
    }
}

