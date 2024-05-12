using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

internal class PlanHistoryEntityTypeConfiguration : IEntityTypeConfiguration<PlanHistory>
{
    public void Configure(EntityTypeBuilder<PlanHistory> builder)
    {
        builder.ToTable("plan_history");

        builder.Property(p => p.DateStart)
               .HasColumnName("date_start")
               .IsRequired();

        builder.Property(p => p.DateEnd)
               .HasColumnName("date_end");

        // Foreign Keys
        builder.Property(p => p.PlanId)
               .HasColumnName("plan_id");

        builder.Property(p => p.SubscriptionId)
             .HasColumnName("subscription_id");

        builder.HasOne(p => p.Plan)  // One to Many
                .WithMany(p => p.PlanHistories)
                .HasForeignKey(p => p.PlanId)
                .IsRequired();

        builder.HasOne(p => p.Subscription)  // One to Many
               .WithMany(p => p.PlanHistories)
               .HasForeignKey(p => p.SubscriptionId)
               .IsRequired();

    }
}
