using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Collection : BaseAuditableEntity
{
    public string? Name { get; set; }

    public string? Icon { get; set; }

    public int ParentNodeId { get; set; } // foreign key property

    public int CollectionGroupId { get; set; }

    public CollectionGroup CollectionGroup { get; set; } = null!;
    public Collection ParentNode { get; set; } = null!; // reference navigation to principal
    public Collection ChildNode { get; set; } = null!; // reference navigation to dependent

    public List<Bookmark> Bookmarks { get; } = [];
}
