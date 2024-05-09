using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class UserAccountEntityTypeConfiguration : IEntityTypeConfiguration<UserAccount>
{
    public void Configure(EntityTypeBuilder<UserAccount> builder)
    {
        builder.ToTable("user_account");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.UserName)
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.Name)
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.DateOfBirth)
               .HasColumnName("date_of_birth")
               .IsRequired();

        builder.Property(p => p.PaymentProviderCustomerId)
              .HasColumnName("payment_provider_customer_id")
              .IsRequired();

        // Auditable
        builder.Property(p => p.Created)
       .IsRequired();

        builder.Property(p => p.LastModified)
                .HasColumnName("last_modified");

        // Foreign Keys
        builder.Property(p => p.RoleId)
               .HasColumnName("role_id");

        builder.HasOne(p => p.UserRole)  // One to Many
        .WithMany(p => p.UserAccounts)
        .HasForeignKey(p => p.RoleId)
        .IsRequired();
        
        builder.HasMany(p => p.IdentityProviders) // Many to Many with join table
          .WithMany(p => p.UserAccounts)
          .UsingEntity<UserAccountIdentityProvider>(
            l => l.HasOne<IdentityProvider>().WithMany(p => p.UserAccountIdentityProviders),
            r => r.HasOne<UserAccount>().WithMany(p => p.UserAccountIdentityProviders));
    
        // TODO: Check the generation of unique rule in user_account_id in subscription
        builder.HasOne(p => p.Subscription)  // One to One
        .WithOne(p => p.UserAccount)
        .HasForeignKey<Subscription>(p => p.UserAccountId)
        .IsRequired();

        // Index
        builder.HasIndex(p => p.UserName);

    }
}
