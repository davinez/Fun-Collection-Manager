using System;
using System.IO;
using Azure.Identity;
using Manager.Application.Common.Interfaces.Services;
using Manager.Infrastructure.Data;
using Manager.IntegrationTests.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;

namespace Manager.IntegrationTests;

using static Testing;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly ITestDatabase _testDatabase;

    public CustomWebApplicationFactory(ITestDatabase testDatabase)
    {
        _testDatabase = testDatabase;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");

        var baseConfigPath = Directory.GetCurrentDirectory();

        // Add config sources from lowest priority to highest
        var preConfig = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();

        // Only add in CI the env variables to activate the use of Key Vault
        var keyVaultUri = preConfig["KEY_VAULT_TEST_ENDPOINT"];

        // Add config sources from lowest priority to highest
        var configBuilder = new ConfigurationBuilder()
            // .AddJsonFile("appsettings.json") // Taken from main wep api project
            // Set the base path to the integration tests build output directory
            // where the integration tests' config files will be copied into.
            .SetBasePath(baseConfigPath)
            .AddJsonFile("appsettings.Test.json")
            .AddJsonFile("appsettings.Test.Development.json", true)
            .AddEnvironmentVariables();

        // We need the environment variables:
        // AZURE_CLIENT_ID,
        // AZURE_TENANT_ID,
        // AZURE_CLIENT_SECRET
        // to make sure the DefaultAzureCredential will work.
        if (!string.IsNullOrWhiteSpace(keyVaultUri))
        {
            configBuilder.AddAzureKeyVault(
                  new Uri(keyVaultUri),
                  new DefaultAzureCredential());
        }

        var config = configBuilder.Build();

        builder
            // This configuration is used during the creation of the application
            // (e.g. BEFORE WebApplication.CreateBuilder(args) is called in Program.cs).
            .UseConfiguration(config)
            .ConfigureAppConfiguration((context, configurationBuilder) =>
            {
                // Clear Config sources
                configurationBuilder.Sources.Clear();

                // This overrides configuration settings that were added as part 
                // of building the Host (e.g. calling WebApplication.CreateBuilder(args)).
                configurationBuilder.AddConfiguration(config);
            });

        var host = _testDatabase.GetHostname();
        var port = _testDatabase.GetPort();
        var connectionString = $"Server={host};Port={port};Database=ManagerDB;User Id=postgres;Password=postgres";

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
