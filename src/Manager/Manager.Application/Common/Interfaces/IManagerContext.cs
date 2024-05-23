using System.Threading;
using System.Threading.Tasks;
using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Common.Interfaces;

public interface IManagerContext
{
    DbSet<Bookmark> Bookmarkss { get; }
    DbSet<Collection> Collectionss { get; }
    DbSet<CollectionGroup> CollectionGroups { get; }
    DbSet<GrantedPermission> GrantedPermissions { get; }
    DbSet<IdentityProvider> IdentityProviders { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<Offer> Offers { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<Plan> Plans { get; }
    DbSet<PlanHistory> PlanHistories { get; }
    DbSet<Subscription> Subscriptions { get; }
    DbSet<UserAccount> UserAccounts { get; }
    DbSet<UserAccountIdentityProvider> UserAccountIdentityProviders { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<WebhookEvent> WebhookEvents { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
