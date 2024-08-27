using System;
using System.IO;
using Ardalis.GuardClauses;
using Docker.DotNet.Models;
using Manager.Application.Common.Interfaces.Services;
using Manager.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;

namespace Manager.FunctionalTests;

using static Testing;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public CustomWebApplicationFactory()
    {
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");

        var baseConfigPath = Directory.GetCurrentDirectory();

        // Add config sources from lowest priority to highest
        var config = new ConfigurationBuilder()
            // .AddJsonFile("appsettings.json") // Taken from main wep api project
            // Set the base path to the integration tests build output directory
            // where the integration tests' config files will be copied into.
            .SetBasePath(baseConfigPath)
            .AddJsonFile("appsettings.Test.json")
            .AddEnvironmentVariables()
            .Build();

        builder
            // This configuration is used during the creation of the application
            // (e.g. BEFORE WebApplication.CreateBuilder(args) is called in Program.cs).
           // .UseConfiguration(config)
            .ConfigureAppConfiguration((context, configurationBuilder) =>
            {
                // Clear Config sources
                configurationBuilder.Sources.Clear();

                // This overrides configuration settings that were added as part 
                // of building the Host (e.g. calling WebApplication.CreateBuilder(args)).
                configurationBuilder.AddConfiguration(config);
            });

        var connectionString = config.GetConnectionString("ManagerTestDB");

        Guard.Against.Null(connectionString, message: "Connection string 'ManagerTestDB' not found in testing environment");

        builder.ConfigureTestServices(services =>
        {
            services
                .RemoveAll<IUser>()
                .AddTransient(provider => Mock.Of<IUser>(user => user.HomeAccountId == GetUserId()));

            services
                .RemoveAll<DbContextOptions<ManagerContext>>()
                .AddDbContext<ManagerContext>((sp, options) =>
                {
                    options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                    options.UseNpgsql(connectionString, x => x.MigrationsHistoryTable("__EFMigrationsHistory", "manager"));
                });
        });
    }
}
