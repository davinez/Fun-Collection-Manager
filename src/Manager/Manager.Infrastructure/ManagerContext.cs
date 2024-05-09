using Manager.Domain.Entities;
using Manager.Infrastructure.EntityConfigurations;
using Microsoft.EntityFrameworkCore;

namespace Manager.Infrastructure;

/// <remarks>
/// Add migrations using the following command inside the 'Manager.Infrastructure' project directory:
///
/// dotnet ef migrations add --startup-project Manager.API --context ManagerContext [migration-name]
/// </remarks>
public class ManagerContext : DbContext
{
    public DbSet<Bookmark> Bookmarkss { get; set; }
    public DbSet<Collection> Collectionss { get; set; }
    public DbSet<CollectionGroup> CollectionGroups { get; set; }
    public DbSet<GrantedPermission> GrantedPermissions { get; set; }
    public DbSet<IdentityProvider> IdentityProviders { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<Plan> Plans { get; set; }
    public DbSet<PlanHistory> PlanHistories { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<UserAccount> UserAccounts { get; set; }
    public DbSet<UserAccountIdentityProvider> UserAccountIdentityProviders { get; set; }
    public DbSet<UserLocation> UserLocations { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<WebhookEvent> WebhookEvents { get; set; }

    public ManagerContext(DbContextOptions<ManagerContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("manager");
        modelBuilder.ApplyConfiguration(new UserAccountEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new UserLoginExternalEntityTypeConfiguration());
    }

}


