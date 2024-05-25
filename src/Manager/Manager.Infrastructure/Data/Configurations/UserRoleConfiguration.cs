using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_role");

        builder.Property(p => p.Description)
               .HasColumnName("description")
               .HasMaxLength(100)
               .IsRequired();

        builder.HasMany(p => p.Permissions) // Many to Many with join table
       .WithMany(p => p.UserRoles)
       .UsingEntity<GrantedPermission>();


    }
}
