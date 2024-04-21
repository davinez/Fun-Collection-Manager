using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class UserAccount : AuditableEntity
{
    [Required]
    public string UserName { get; set; } = string.Empty;

    public IEnumerable<UserLoginExternal> UserLoginExternal { get; private set; } = new List<UserLoginExternal>().AsReadOnly();


}
