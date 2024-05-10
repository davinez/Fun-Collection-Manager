using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Permission : BaseEntity
{
    public string? Description { get; set; }

    public List<UserRole> UserRoles { get; } = [];
    public List<GrantedPermission> GrantedPermissions { get; } = [];
}
