using System;
using System.ComponentModel.DataAnnotations.Schema;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class CollectionGroup: AuditableEntity
{
    [Column("name")]
    public string? Name { get; set; }
    [Column("user_account_id")]
    public int UserAccountId { get; set; }
}
