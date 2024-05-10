using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class UserRole : BaseEntity
{
    public string? Description { get; set; }

    public List<UserAccount> UserAccounts { get; } = [];
    public List<Permission> Permissions { get; } = []; 
    public List<GrantedPermission> GrantedPermissions { get; } = []; 
}
