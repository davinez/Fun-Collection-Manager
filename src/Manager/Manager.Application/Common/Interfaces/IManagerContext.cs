using System.Threading;
using System.Threading.Tasks;
using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Manager.Application.Common.Interfaces;

public interface IManagerContext
{
    DbSet<Bookmark> Bookmarkss { get; }
    DbSet<Collection> Collections { get; }
    DbSet<CollectionGroup> CollectionGroups { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<Offer> Offers { get; }
    DbSet<Plan> Plans { get; }
    DbSet<PlanHistory> PlanHistories { get; }
    DbSet<Subscription> Subscriptions { get; }
    DbSet<UserAccount> UserAccounts { get; }
    DbSet<WebhookEvent> WebhookEvents { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
