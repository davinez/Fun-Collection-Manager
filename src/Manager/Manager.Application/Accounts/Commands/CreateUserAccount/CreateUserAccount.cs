using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.CollectionsGroups.Commands.CreateCollectionGroup;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Entities;
using MediatR;

namespace Manager.Application.Accounts.Commands.CreateUserAccount;
public record CreateUserAccountCommand : IRequest<int>
{
    public string EntraUserId { get; init; } = string.Empty;
    public string? Username { get; init; } = string.Empty;
    public string? Name { get; init; } = string.Empty;
    public DateTime DateOfBirth { get; init; }
    public string? Country { get; init; } = string.Empty;
    public string? ZipCode { get; init; } = string.Empty;

}

public class CreateUserAccountCommandHandler : IRequestHandler<CreateUserAccountCommand, int>
{
    private readonly IManagerContext _context;
    private readonly IMicrosoftGraphService _microsoftGraphService;

    public CreateUserAccountCommandHandler(IManagerContext context, IMicrosoftGraphService microsoftGraphService)
    {
        _context = context;
        _microsoftGraphService = microsoftGraphService;
    }

    public async Task<int> Handle(CreateUserAccountCommand request, CancellationToken cancellationToken)
    {
        // Add role to user
       bool roleResponse = await _microsoftGraphService.AssignRoleToUser(request.EntraUserId);

        if (!roleResponse)
            throw new ManagerException($"Error in role assing for EntraUserId {request.EntraUserId}");

        var entity = new UserAccount
        {
            UserName = ""
        };

        _context.UserAccounts.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
