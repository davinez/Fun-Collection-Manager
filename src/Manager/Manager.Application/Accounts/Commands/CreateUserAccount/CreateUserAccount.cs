using System;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Entities;
using MediatR;
using Microsoft.Graph.Models;

namespace Manager.Application.Accounts.Commands.CreateUserAccount;
public record CreateUserAccountCommand : IRequest<Unit>
{
    public required string IdentityProviderId { get; init; }
    public CreateSubscription CreateSubscription { get; init; } = new CreateSubscription();
}

public record CreateSubscription
{
    public bool IsTrialPeriod { get; init; }
    public bool? SubscribeAfterTrial { get; init; }
    public DateTime ValidTo { get; init; }
    public int? OfferId { get; init; }
    public int PlanAcquired { get; init; }
}


public class CreateUserAccountCommandHandler : IRequestHandler<CreateUserAccountCommand, Unit>
{
    private readonly IManagerContext _context;
    private readonly IMicrosoftGraphService _microsoftGraphService;

    public CreateUserAccountCommandHandler(IManagerContext context, IMicrosoftGraphService microsoftGraphService)
    {
        _context = context;
        _microsoftGraphService = microsoftGraphService;
    }

    public async Task<Unit> Handle(CreateUserAccountCommand request, CancellationToken cancellationToken)
    {
        // Add role to user
        bool roleResponse = await _microsoftGraphService.AssignRoleToUser(request.IdentityProviderId);

        if (!roleResponse)
            throw new ManagerException($"Error in role assign for EntraUserId {request.IdentityProviderId}");

        User userEntra = await _microsoftGraphService.GetUserById(request.IdentityProviderId);

        var newUserAccount = new Domain.Entities.UserAccount
        {
            IdentityProviderId = request.IdentityProviderId,
            DisplayName = userEntra.DisplayName,
            GivenName = userEntra.GivenName,
            Country = userEntra.Country,
            City = userEntra.City,
        };

        var newSubscription = new Domain.Entities.Subscription()
        {
            CurrentPlanId = request.CreateSubscription.PlanAcquired,
            DateSubscribed = DateTime.UtcNow,
            ValidTo = request.CreateSubscription.ValidTo,
            OfferId = request.CreateSubscription.OfferId
        };

        if (request.CreateSubscription.IsTrialPeriod)
        {
            newSubscription.TrialPeriodStartDate = DateTime.UtcNow;
            newSubscription.TrialPeriodEndDate = request.CreateSubscription.ValidTo;
            newSubscription.SubscribeAfterTrial = request.CreateSubscription.SubscribeAfterTrial ?? false;
        }

        newUserAccount.Subscription = newSubscription;

        _context.UserAccounts.Add(newUserAccount);

        await _context.SaveChangesAsync(cancellationToken);

        var defaultCollectionGroup = new CollectionGroup
        {
            Name = "First Group",
            UserAccountId = newUserAccount.Id,
        };

        _context.CollectionGroups.Add(defaultCollectionGroup);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
