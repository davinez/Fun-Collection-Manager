namespace Manager.Domain.Entities;

public class UserAccountIdentityProvider
{
    public int UserAccountId { get; set; }
    public int IdentityProviderId { get; set; }

    public UserAccount UserAccount { get; set; } = null!;
    public IdentityProvider IdentityProvider { get; set; } = null!;
}
