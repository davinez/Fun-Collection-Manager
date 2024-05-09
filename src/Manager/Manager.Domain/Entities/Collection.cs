using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Collection : AuditableEntity
{

    public string? Name { get; set; }
    public string? Icon { get; set; }
    public int ParentId { get; set; }
    public int CollectionGroupId { get; set; }
}
