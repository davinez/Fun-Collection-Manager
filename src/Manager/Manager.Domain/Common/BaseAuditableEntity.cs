using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Manager.Domain.Common;

public abstract class BaseAuditableEntity : BaseEntity
{
    [Column("created")]
    [Required]
    public DateTimeOffset Created { get; set; }
    [Column("last_modified")]
    public DateTimeOffset? LastModified { get; set; }
}
