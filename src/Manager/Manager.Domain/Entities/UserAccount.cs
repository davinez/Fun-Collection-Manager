using System;
using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class UserAccount : AuditableEntity
{
    public string? UserName { get; set; }
    public string? Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int PaymentProviderCustomerId { get; set; }
    public int RoleId { get; set; }


    public IEnumerable<UserLoginExternal> UserLoginExternal { get; private set; } = new List<UserLoginExternal>().AsReadOnly();


}
