using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class IdentityProvider : BaseEntity
{
    public string? ProviderName { get; set; }

    public List<UserAccount> UserAccounts { get; } = [];
    public List<UserAccountIdentityProvider> UserAccountIdentityProviders { get; } = [];
}
