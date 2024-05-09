using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class UserAccountIdentityProviderEntityTypeConfiguration : IEntityTypeConfiguration<UserAccountIdentityProvider>
{

    public void Configure(EntityTypeBuilder<UserAccountIdentityProvider> builder)
    {
        builder.ToTable("use_account_identity_provider");

    }
}
