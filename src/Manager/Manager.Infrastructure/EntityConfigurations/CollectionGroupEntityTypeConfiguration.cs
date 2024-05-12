using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.EntityConfigurations;

public class CollectionGroupEntityTypeConfiguration : IEntityTypeConfiguration<CollectionGroup>
{
    public void Configure(EntityTypeBuilder<CollectionGroup> builder)
    {
        builder.ToTable("collection_group");

        builder.Property(p => p.Name)
               .HasColumnName("name")
               .HasMaxLength(100)
               .IsRequired();

        // Foreign Keys
        builder.Property(p => p.UserAccountId)
               .HasColumnName("user_account_id");

        builder.HasOne(p => p.UserAccount)  // One to Many
               .WithMany(p => p.CollectionGroups)
               .HasForeignKey(p => p.UserAccountId)
               .IsRequired();

    }
}
