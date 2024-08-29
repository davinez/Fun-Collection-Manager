using System;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Accounts.Queries.GetUserAccountByIdP;

public record GetUserAccountByIdPQuery : IRequest<UserAccountDto?>
{
    public required string IdentityProviderId { get; init; }
}

public class GetUserAccountByIdPQueryHandler : IRequestHandler<GetUserAccountByIdPQuery, UserAccountDto?>
{
    private readonly IManagerContext _context;

    public GetUserAccountByIdPQueryHandler(IManagerContext context)
    {
        _context = context;
    }

    public async Task<UserAccountDto?> Handle(GetUserAccountByIdPQuery request, CancellationToken cancellationToken)
    {
        var userAccount = await _context.UserAccounts.AsNoTracking().FirstOrDefaultAsync(u => u.IdentityProviderId == request.IdentityProviderId);

        return userAccount == null ? null : new UserAccountDto(userAccount);

    }
}



