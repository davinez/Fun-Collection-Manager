﻿using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Manager.Infrastructure.Data.Configurations;

public class BookmarkConfiguration : IEntityTypeConfiguration<Bookmark>
{
    public void Configure(EntityTypeBuilder<Bookmark> builder)
    {

        builder.ToTable("bookmark");

        builder.Property(p => p.Cover)
               .HasColumnName("cover")
               .HasMaxLength(255);

        builder.Property(p => p.Title)
               .HasColumnName("title")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(p => p.Description)
               .HasColumnName("description")
               .HasMaxLength(255)
               .IsRequired();

        builder.Property(p => p.WebsiteUrl)
               .HasColumnName("website_url")
               .HasMaxLength(2048)
               .IsRequired();

        // Foreign Keys
        builder.Property(p => p.CollectionId)
               .HasColumnName("collection_id");

        builder.HasOne(p => p.Collection)  // One to Many
               .WithMany(p => p.Bookmarks)
               .HasForeignKey(p => p.CollectionId)
               .IsRequired();

    }
}

