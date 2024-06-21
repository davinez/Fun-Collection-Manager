using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

public class UserAccountConfiguration : IEntityTypeConfiguration<UserAccount>
{
    public void Configure(EntityTypeBuilder<UserAccount> builder)
    {
        builder.ToTable("user_account");

        builder.Property(p => p.IdentityProviderId)
               .HasColumnName("identity_provider_id")
               .HasMaxLength(255)
               .IsRequired();

        builder.Property(p => p.UserName)
               .HasColumnName("username")
               .HasMaxLength(100);

        builder.Property(p => p.DisplayName)
               .HasColumnName("display_name")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.GivenName)
               .HasColumnName("given_name")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.Country)
               .HasColumnName("country")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.City)
               .HasColumnName("city")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.PaymentProviderCustomerId)
               .HasColumnName("payment_provider_customer_id");

        // Foreign Keys

        // TODO: Check the generation of unique rule in user_account_id in subscription
        builder.HasOne(p => p.Subscription)  // One to One
               .WithOne(p => p.UserAccount)
               .HasForeignKey<Subscription>(p => p.UserAccountId)
               .IsRequired();

        // Index
        builder.HasIndex(p => p.UserName);

    }
}
