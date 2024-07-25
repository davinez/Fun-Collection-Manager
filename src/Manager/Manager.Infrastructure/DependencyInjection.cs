using System;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using Manager.Infrastructure.Data;
using Manager.Infrastructure.Data.Interceptors;
using Manager.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Manager.Infrastructure;

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
            options.UseNpgsql(connectionString, x => x.MigrationsHistoryTable("__EFMigrationsHistory", "manager"));
        });

        services.AddScoped<IManagerContext>(provider => provider.GetRequiredService<ManagerContext>());

        services.AddScoped<IManagerReadDbConnection, ManagerReadDbConnection>();

        services.AddScoped<ApplicationDbContextInitialiser>();

        services.AddScoped<IMicrosoftGraphService, MicrosoftGraphService>();
        services.AddScoped<IS3StorageService, S3StorageService>();

        services.AddHttpClient<IManagerSupportService, ManagerSupportService>();

        // TODO: Is nessecary?
        services.AddAuthentication()
                .AddBearerToken(IdentityConstants.BearerScheme);

        services.AddSingleton(TimeProvider.System);

        return services;
    }
}

