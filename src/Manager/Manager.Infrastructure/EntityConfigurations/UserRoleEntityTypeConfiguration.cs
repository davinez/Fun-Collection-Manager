using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class UserRoleEntityTypeConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_role");

        builder.Property(p => p.Description)
               .HasColumnName("description")
               .HasMaxLength(100)
               .IsRequired();

        // Foreign Keys
        builder.HasMany(p => p.Permissions) // Many to Many with join table
        .WithMany(p => p.UserRoles)
        .UsingEntity<GrantedPermission>(
          l => l.HasOne<Permission>().WithMany(p => p.GrantedPermissions).HasForeignKey(p => p.PermissionId),
          r => r.HasOne<UserRole>().WithMany(p => p.GrantedPermissions).HasForeignKey(p => p.UserRoleId));


    }
}
