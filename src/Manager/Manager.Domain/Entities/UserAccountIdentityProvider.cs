namespace Manager.Domain.Entities;

public class UserAccountIdentityProvider
{
    public int UserAccountId { get; set; }
    public int IdentityProviderId { get; set; }
}
