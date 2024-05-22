using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

public class IdentityProviderConfiguration : IEntityTypeConfiguration<IdentityProvider>
{
    public void Configure(EntityTypeBuilder<IdentityProvider> builder)
    {
        builder.ToTable("identity_provider");

        builder.Property(p => p.ProviderName)
               .HasColumnName("provider_name");
    }
}
