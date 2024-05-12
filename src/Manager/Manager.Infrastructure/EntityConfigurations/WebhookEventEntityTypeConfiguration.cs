using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class WebhookEventEntityTypeConfiguration : IEntityTypeConfiguration<WebhookEvent>
{
    public void Configure(EntityTypeBuilder<WebhookEvent> builder)
    {

        builder.ToTable("webhook_event");

        builder.Property(p => p.Data)
               .HasColumnName("data")
               .HasColumnType("bytea")
               .IsRequired();

        builder.Property(p => p.Stale)
               .HasColumnName("stale")
               .IsRequired();

        builder.Property(p => p.ProcessingErrors)
               .HasColumnName("processing_erros")
               .HasMaxLength(600)
               .IsRequired();

        builder.Property(p => p.ExternalId)
               .HasColumnName("external_id")
               .HasMaxLength(255)
               .IsRequired();

    }
}

