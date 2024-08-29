using System;
using Manager.Domain.Entities;

namespace Manager.Application.Accounts.Queries.GetUserAccountByIdP;

public class UserAccountDto
{
    public UserAccountDto()
    {

    }

    public UserAccountDto(UserAccount userAccount)
    {
        Id = userAccount.Id;
        IdentityProviderId = userAccount.IdentityProviderId;
        CreatedDate = userAccount.Created;
    }

    public int Id { get; set; }
    public string? IdentityProviderId { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
}
