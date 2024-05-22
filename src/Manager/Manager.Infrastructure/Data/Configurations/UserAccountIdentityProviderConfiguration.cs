using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

public class UserAccountIdentityProviderConfiguration : IEntityTypeConfiguration<UserAccountIdentityProvider>
{

    public void Configure(EntityTypeBuilder<UserAccountIdentityProvider> builder)
    {
        builder.ToTable("use_account_identity_provider");

        builder.Property(p => p.UserAccountId)
               .HasColumnName("user_account_id");

        builder.Property(p => p.IdentityProviderId)
               .HasColumnName("identity_provider_id");

    }
}
