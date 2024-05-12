using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class SubscriptionEntityTypeConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.ToTable("subscription");

        builder.Property(p => p.TrialPeriodStartDate)
               .HasColumnName("trial_period_start_date");

        builder.Property(p => p.TrialPeriodEndDate)
               .HasColumnName("trial_period_end_date");

        builder.Property(p => p.SubscribeAfterTrial)
               .HasColumnName("subscribe_after_trial")
               .IsRequired();

        builder.Property(p => p.DateSubscribed)
               .HasColumnName("date_subscribed")
               .IsRequired();

        builder.Property(p => p.ValidTo)
               .HasColumnName("valid_to")
               .IsRequired();

        builder.Property(p => p.DateUnsubscribed)
              .HasColumnName("date_unsubscribed");

        // Foreign Keys
        builder.Property(p => p.OfferId)
               .HasColumnName("offer_id");

        builder.Property(p => p.CurrentPlanId)
               .HasColumnName("current_plan_id");

        builder.HasOne(p => p.Offer)  // One to Many
               .WithMany(p => p.Subscriptions)
               .HasForeignKey(p => p.OfferId);

        builder.HasOne(p => p.Plan)  // One to Many
               .WithMany(p => p.Subscriptions)
               .HasForeignKey(p => p.CurrentPlanId)
               .IsRequired();

    }
}
