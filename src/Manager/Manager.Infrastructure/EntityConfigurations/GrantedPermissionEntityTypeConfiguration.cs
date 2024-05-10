using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class GrantedPermissionEntityTypeConfiguration : IEntityTypeConfiguration<GrantedPermission>
{
    public void Configure(EntityTypeBuilder<GrantedPermission> builder)
    {
        builder.ToTable("granted_permission");

        builder.Property(p => p.UserRoleId)
               .HasColumnName("user_role_id");

        builder.Property(p => p.PermissionId)
               .HasColumnName("permission_id");
    }
}
