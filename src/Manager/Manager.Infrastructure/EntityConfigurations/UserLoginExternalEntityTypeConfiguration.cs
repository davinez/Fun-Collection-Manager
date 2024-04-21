using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class UserLoginExternalEntityTypeConfiguration : IEntityTypeConfiguration<UserLoginExternal>
{
    public void Configure(EntityTypeBuilder<UserLoginExternal> builder)
    {
        builder.ToTable("user_login_external");

    }
}

