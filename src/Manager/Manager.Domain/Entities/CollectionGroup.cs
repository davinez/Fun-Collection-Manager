using System;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class CollectionGroup: AuditableEntity
{
    public string? Name { get; set; }
    public int UserAccountId { get; set; }
}
