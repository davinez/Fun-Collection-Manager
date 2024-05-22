namespace Manager.Domain.Entities;

public class GrantedPermission
{
    public int UserRoleId { get; set; }
    public int PermissionId { get; set; }

    public UserRole UserRole { get; set; } = null!;
    public Permission Permission { get; set; } = null!;
}
