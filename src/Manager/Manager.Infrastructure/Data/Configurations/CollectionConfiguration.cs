using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

public class CollectionConfiguration : IEntityTypeConfiguration<Collection>
{
    public void Configure(EntityTypeBuilder<Collection> builder)
    {
        builder.ToTable("collection");

        builder.Property(p => p.Name)
               .HasColumnName("name")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.Icon)
               .HasColumnName("icon")
               .HasMaxLength(255)
               .IsRequired();

        // Foreign Keys
        builder.Property(p => p.ParentNodeId)
               .HasColumnName("parent_node_id");

        builder.Property(p => p.CollectionGroupId)
               .HasColumnName("collection_group_id");

        builder.HasOne(p => p.CollectionGroup)  // One to Many
               .WithMany(p => p.Collections)
               .HasForeignKey(p => p.CollectionGroupId)
        .IsRequired();

        builder.HasOne(e => e.ParentNode)
               .WithOne(e => e.ChildNode)
               .HasForeignKey<Collection>(e => e.ParentNodeId)
               .OnDelete(DeleteBehavior.Cascade) // TODO: Check correct delete of parent and child nodes
               .IsRequired(false);

    }
}
