using System.ComponentModel.DataAnnotations;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class UserLoginExternal : AuditableEntity
{
    // FK 
    public int UserAccountId { get; set; }

    [Required]
    public string ExternalProviderId { get; set; } = string.Empty;
}
