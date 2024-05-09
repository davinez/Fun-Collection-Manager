using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class UserRole : BaseEntity
{
    public string? Description { get; set; }

    public ICollection<UserAccount> UserAccounts { get; } = new List<UserAccount>();
}
