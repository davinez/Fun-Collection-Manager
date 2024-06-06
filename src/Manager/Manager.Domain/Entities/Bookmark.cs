using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Bookmark : BaseAuditableEntity
{
    public string? Cover { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? WebsiteUrl { get; set; }

    public int CollectionId { get; set; }

    public Collection Collection { get; set; } = null!;
}
