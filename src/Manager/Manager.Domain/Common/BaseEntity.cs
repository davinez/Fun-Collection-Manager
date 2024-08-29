using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Manager.Domain.Common;

public abstract class BaseEntity
{
    [Column("id")]
    [Key]
    public int Id { get; set; }
}
