using System.ComponentModel.DataAnnotations.Schema;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Collection : AuditableEntity
{
    [Column("name")]
    public string? Name { get; set; }
    [Column("icon")]
    public string? Icon { get; set; }
    [Column("parent_id")]
    public int ParentId { get; set; }
    [Column("collection_group_id")]
    public int CollectionGroupId { get; set; }
}
