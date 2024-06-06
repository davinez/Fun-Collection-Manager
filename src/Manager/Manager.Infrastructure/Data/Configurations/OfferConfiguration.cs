using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

internal class OfferConfiguration : IEntityTypeConfiguration<Offer>
{
    public void Configure(EntityTypeBuilder<Offer> builder)
    {
        builder.ToTable("offer");

        builder.Property(p => p.OfferName)
               .HasMaxLength(100)
               .HasColumnName("offer_name")
               .IsRequired();

        builder.Property(p => p.OfferStartDate)
               .HasColumnName("offer_start_date")
               .IsRequired();

        builder.Property(p => p.OfferEndDate)
               .HasColumnName("offer_end_date");

        builder.Property(p => p.Description)
               .HasMaxLength(100)
               .HasColumnName("description")
               .IsRequired();

        builder.Property(p => p.DiscountAmount)
               .HasColumnName("discount_amount");

        builder.Property(p => p.DiscountPercentage)
               .HasColumnName("discount_percentage");
    }
}
