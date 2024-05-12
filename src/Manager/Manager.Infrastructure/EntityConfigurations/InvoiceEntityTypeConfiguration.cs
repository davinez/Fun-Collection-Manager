using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class InvoiceEntityTypeConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {

        builder.ToTable("invoice");

        builder.Property(p => p.CustomerInvoiceData)
               .HasColumnName("customer_invoice_data")
               //.HasMaxLength()
               .IsRequired();

        builder.Property(p => p.InvoicePeriodStartDate)
               .HasColumnName("invoice_period_start_date")
               .IsRequired();

        builder.Property(p => p.InvoicePeriodEndDate)
               .HasColumnName("invoice_period_end_date")
               .IsRequired();

        builder.Property(p => p.InvoiceDescription)
               .HasColumnName("invoice_description")
               //.HasMaxLength()
               .IsRequired();

        builder.Property(p => p.InvoiceAmount)
               .HasColumnName("invoice_amount")
               .IsRequired();

        builder.Property(p => p.InvoiceCreatedDate)
              .HasColumnName("invoice_created_date")
              .IsRequired();

        builder.Property(p => p.InvoiceDueDate)
               .HasColumnName("invoice_due_date")
               .IsRequired();

        builder.Property(p => p.InvoicePaidDate)
               .HasColumnName("invoice_paid_date");

        // Foreign Keys
        builder.Property(p => p.PlanHistoryId)
              .HasColumnName("plan_history_id");

        builder.Property(p => p.SubscriptionId)
               .HasColumnName("subscription_id");

        builder.HasOne(p => p.PlanHistory)  // One to Many
        .WithMany(p => p.Invoices)
        .HasForeignKey(p => p.PlanHistoryId)
        .IsRequired();

        builder.HasOne(p => p.Subscription)  // One to Many
       .WithMany(p => p.Invoices)
       .HasForeignKey(p => p.SubscriptionId)
       .IsRequired();

    }
}

