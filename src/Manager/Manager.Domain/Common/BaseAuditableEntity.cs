using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Manager.Domain.Common;

public class AuditableEntity : BaseEntity
{
    public DateTime Created { get; set; }
    [Column("last_modified")]
    public DateTime? LastModified { get; set; }
}
