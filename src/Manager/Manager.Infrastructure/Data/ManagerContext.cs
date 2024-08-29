using System.Reflection;
using Manager.Application.Common.Interfaces;
using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Manager.Infrastructure.Data;

public class ManagerContext : DbContext, IManagerContext
{
    public DbSet<Bookmark> Bookmarks { get; set; }
    public DbSet<Collection> Collections { get; set; }
    public DbSet<CollectionGroup> CollectionGroups { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<Plan> Plans { get; set; }
    public DbSet<PlanHistory> PlanHistories { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<UserAccount> UserAccounts { get; set; }
    public DbSet<WebhookEvent> WebhookEvents { get; set; }

    public ManagerContext(DbContextOptions<ManagerContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema("manager");
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

}


