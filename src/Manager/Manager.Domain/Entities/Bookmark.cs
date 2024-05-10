using System.ComponentModel.DataAnnotations.Schema;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Bookmark : AuditableEntity
{
    [Column("cover")]
    public string? Cover { get; set; }

    [Column("title")]
    public string? Title { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("website_url")]
    public string? WebsiteUrl { get; set; }

    [Column("collection_id")]
    public int CollectionId { get; set; }
}
