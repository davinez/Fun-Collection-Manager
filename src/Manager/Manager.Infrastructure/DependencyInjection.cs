using System;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Infrastructure.Data;
using Manager.Infrastructure.Data.Interceptors;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("managerdb");

        Guard.Against.Null(connectionString, message: "Connection string 'managerdb' not found.");

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();

        services.AddDbContext<ManagerContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<IManagerContext>(provider => provider.GetRequiredService<ManagerContext>());

        services.AddScoped<ApplicationDbContextInitialiser>();


        services.AddAuthentication()
                .AddBearerToken(IdentityConstants.BearerScheme);

        //services.AddAuthorizationBuilder();

        //services
        //    .AddIdentityCore<ApplicationUser>()
        //    .AddRoles<IdentityRole>()
        //    .AddEntityFrameworkStores<ApplicationDbContext>()
        //    .AddApiEndpoints();

        //services.AddAuthorization(options =>
        //        options.AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator)));

        services.AddSingleton(TimeProvider.System);

        return services;
    }
}

