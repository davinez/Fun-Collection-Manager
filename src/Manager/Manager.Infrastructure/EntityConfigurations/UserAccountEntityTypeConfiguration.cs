using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class UserAccountEntityTypeConfiguration : IEntityTypeConfiguration<UserAccount>
{
    public void Configure(EntityTypeBuilder<UserAccount> builder)
    {
        builder.ToTable("user_account");

        builder.Property(u => u.UserName)
            .HasMaxLength(50);


        builder.HasOne(ci => ci.UserLoginExternal)
            .WithMany();

        builder.HasIndex(ci => ci.UserName);
    }
}
