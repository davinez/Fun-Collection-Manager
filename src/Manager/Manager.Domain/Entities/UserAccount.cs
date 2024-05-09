using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class UserAccount : AuditableEntity
{
    public string? UserName { get; set; }
    public string? Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int PaymentProviderCustomerId { get; set; } // Not in use for the moment until payment module its implementes
    public int RoleId { get; set; } // Required foreign key property

    public Subscription Subscription { get; set; } = null!;
    public UserRole UserRole { get; set; } = null!; // Required reference navigation to principal
    public List<IdentityProvider> IdentityProviders { get; } = []; // Skip navigation of join table
    public List<UserAccountIdentityProvider> UserAccountIdentityProviders { get; } = []; // Join Table many to many
}
