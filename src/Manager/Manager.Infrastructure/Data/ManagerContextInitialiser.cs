using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Manager.Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();

        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ManagerContext _context;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger, ManagerContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            if ((await _context.Database.GetPendingMigrationsAsync()).Any())
            {
                await _context.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        //var rolePermissions = new Dictionary<Permission, UserRole>()
        //{
        //    {
        //        new Permission()
        //        {
        //            Description = Permissions.CanAccessAdminSection
        //        },
        //        new UserRole()
        //        {
        //            Description = Roles.Administrator
        //        }
        //    },
        //    {
        //        new Permission()
        //        {
        //            Description = Permissions.CanAccessManagerSection
        //        },
        //        new UserRole()
        //        {
        //            Description = Roles.User
        //        }
        //    },
        //    {
        //        new Permission()
        //        {
        //            Description = Permissions.CanAccessManagerSection
        //        },
        //        new UserRole()
        //        {
        //            Description = Roles.Administrator
        //        }
        //    },
        //};

        //// Default permissions
        //if (!_context.Permissions.Any() && !_context.UserRoles.Any() && !_context.GrantedPermissions.Any())
        //{
        //    // var grantedPermissions = new List<GrantedPermission>();

        //    foreach (KeyValuePair<Permission, UserRole> rolePermission in rolePermissions)
        //    {
        //        _context.Permissions.Add(rolePermission.Key);
        //        _context.UserRoles.Add(rolePermission.Value);

        //        _context.GrantedPermissions.Add(new GrantedPermission()
        //        {
        //            PermissionId = rolePermission.Key.Id,
        //            UserRoleId = rolePermission.Value.Id
        //        });
        //    }
        //}

        //// Default roles
        //if (!_context.UserRoles.Any())
        //{
        //    _context.UserRoles.AddRange(
        //     new UserRole()
        //     {
        //         Description = Roles.Administrator
        //     },
        //     new UserRole()
        //     {
        //         Description = Roles.User
        //     }
        //    );
        //}

        // Default Plan
        if (!_context.Plans.Any())
        {
            _context.Plans.Add(new()
            {
                PlanName = "Basic",
                CurrentPrice = 0.0m,
                IsActive = true,
            });
        }

        await _context.SaveChangesAsync();
    }
}

