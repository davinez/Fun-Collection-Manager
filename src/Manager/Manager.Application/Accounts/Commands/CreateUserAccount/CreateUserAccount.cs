using System;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Entities;
using MediatR;

namespace Manager.Application.Accounts.Commands.CreateUserAccount;
public record CreateUserAccountCommand : IRequest<int>
{
    public Guid IdentityProviderId { get; init; }
    public string? Username { get; init; } = string.Empty;
    public string? Name { get; init; } = string.Empty;
    public DateTime DateOfBirth { get; init; }
    public string? Country { get; init; } = string.Empty;
    public string? ZipCode { get; init; } = string.Empty;
    public CreateSubscription? CreateSubscription { get; init; }

}

public record CreateSubscription
{
    public bool IsTrialPeriod { get; init; }
    public DateTime? TrialValidTo { get; init; }
    public bool OfferAcquired { get; init; }
    public int? OfferId { get; init; }
    public int PlanAcquired { get; init; }
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
        bool roleResponse = await _microsoftGraphService.AssignRoleToUser(request.IdentityProviderId);

        if (!roleResponse)
            throw new ManagerException($"Error in role assing for EntraUserId {request.IdentityProviderId}");

        var entity = new UserAccount
        {
            IdentityProviderId = request.IdentityProviderId,
            UserName = request.Username,
            Name = request.Name,
            DateOfBirth = request.DateOfBirth,
            Country = request.Country,
            ZipCode = request.ZipCode,
        };

        _context.UserAccounts.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
