using System;
using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class UserAccount : BaseAuditableEntity
{
    public required string IdentityProviderId { get; set; }
    public string? UserName { get; set; }
    public string? DisplayName { get; set; }
    public string? GivenName { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public int? PaymentProviderCustomerId { get; set; } // Not in use for the moment until payment module its implementes

    public Subscription Subscription { get; set; } = null!;
    public List<CollectionGroup> CollectionGroups { get; } = [];

}
