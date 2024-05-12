using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class CollectionGroup : AuditableEntity
{
    public string? Name { get; set; }
    public int UserAccountId { get; set; }

    public UserAccount UserAccount { get; set; } = null!;

    public List<Collection> Collections { get; } = [];


}
