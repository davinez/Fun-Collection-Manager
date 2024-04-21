using System.Threading.Tasks;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using System;
using Manager.Domain.Entities;
using MediatR;
using Manager.Infrastructure.EntityConfigurations;
using Manager.Domain.Common;
using System.Linq;

namespace Manager.Infrastructure;

/// <remarks>
/// Add migrations using the following command inside the 'Manager.Infrastructure' project directory:
///
/// dotnet ef migrations add --startup-project Manager.API --context ManagerContext [migration-name]
/// </remarks>
public class ManagerContext : DbContext
{
    public DbSet<UserAccount> UserAccounts { get; set; }
    public DbSet<UserLoginExternal> UserLoginExternal { get; set; }

    private readonly IMediator _mediator;

    public ManagerContext(DbContextOptions<ManagerContext> options, IMediator mediator) : base(options)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        System.Diagnostics.Debug.WriteLine("ManagerContext::ctor ->" + this.GetHashCode());
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("manager");
        modelBuilder.ApplyConfiguration(new UserAccountEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new UserLoginExternalEntityTypeConfiguration());
    }

    public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default)
    {
        // Dispatch Domain Events collection. 
        // Choices:
        // A) Right BEFORE committing data (EF SaveChanges) into the DB will make a single transaction including  
        // side effects from the domain event handlers which are using the same DbContext with "InstancePerLifetimeScope" or "scoped" lifetime
        // B) Right AFTER committing data (EF SaveChanges) into the DB will make multiple transactions. 
        // You will need to handle eventual consistency and compensatory actions in case of failures in any of the Handlers. 
        await DispatchDomainEventsAsync();

        // After executing this line all the changes (from the Command Handler and Domain Event Handlers) 
        // performed through the DbContext will be committed
        _ = await base.SaveChangesAsync(cancellationToken);

        return true;
    }

    private async Task DispatchDomainEventsAsync()
    {
        var domainEntities = this.ChangeTracker
            .Entries<Entity>()
            .Where(x => x.Entity.DomainEvents != null && x.Entity.DomainEvents.Any());

        var domainEvents = domainEntities
            .SelectMany(x => x.Entity.DomainEvents)
            .ToList();

        domainEntities.ToList()
            .ForEach(entity => entity.Entity.ClearDomainEvents());

        foreach (var domainEvent in domainEvents)
            await _mediator.Publish(domainEvent);
    }

}


