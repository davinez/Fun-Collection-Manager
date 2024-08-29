using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

internal class PlanConfiguration : IEntityTypeConfiguration<Plan>
{
    public void Configure(EntityTypeBuilder<Plan> builder)
    {
        builder.ToTable("plan");

        builder.Property(p => p.PlanName)
               .HasMaxLength(100)
               .HasColumnName("plan_name")
               .IsRequired();

        builder.Property(p => p.CurrentPrice)
               .HasColumnName("current_price")
               .IsRequired();

        builder.Property(p => p.IsActive)
               .HasColumnName("is_active")
               .IsRequired();

    }
}
