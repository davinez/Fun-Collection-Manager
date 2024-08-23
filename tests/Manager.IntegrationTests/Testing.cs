﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Manager.Application.Common.Exceptions;
using Manager.Domain.Entities;
using Manager.FunctionalTests.Database;
using Manager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Client;
using NUnit.Framework;

namespace Manager.FunctionalTests;

/*
Static Fields and Properties

Static fields and properties are shared among all instances of a class. 
They are initialized only once, when the type is first accessed, 
and their values are preserved across multiple instances of the class. 
Static fields and properties are declared using the static keyword before 
the field or property declaration.

More: https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-8.0
*/


[SetUpFixture]
public partial class Testing
{
    private static ITestDatabase _database;
    private static CustomWebApplicationFactory _factory = null!;
    private IConfiguration _config = null!;

    // Auth Azure Entra ID
    private static IPublicClientApplication _azureAD = null!;
    private static string? _homeAccountId = null!;
    private static string? _entraIdAccessToken = null!;

    private static string _authority = null!;
    private static string _tenantId = null!;
    private static string _clientId = null!;
    private static string _adminFucomaUsername = null!;
    private static string _adminFucomaPassword = null!;


    [OneTimeSetUp]
    public async Task RunBeforeAnyTests()
    {
        // Database
        _database = await DatabaseFactory.CreateAsync();

        // App Factory
        _factory = new CustomWebApplicationFactory(_database.GetConnection());
        _config = _factory.Services.GetService<IConfiguration>() ?? throw new ArgumentNullException($"Null IConfig Service in {nameof(Testing)}");

        // Migrations
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ManagerContext>();
        await dbContext.Database.MigrateAsync();

        await _database.InitialiseRespawnAsyn();

        // Seeding
        await SeedAsync();

        // Config Values
        _authority = _config.GetValue<string>("EntraID:Authority") ?? throw new ArgumentNullException($"Null value for Authority in {nameof(Testing)}");
        _tenantId = _config.GetValue<string>("EntraID:Authority") ?? throw new ArgumentNullException($"Null value for TenantId in {nameof(Testing)}");
        _clientId = _config.GetValue<string>("EntraID:Authority") ?? throw new ArgumentNullException($"Null value for ClientId in {nameof(Testing)}");
        _adminFucomaUsername = _config.GetValue<string>("EntraID:Authority") ?? throw new ArgumentNullException($"Null value for AdminFucomaUsername in {nameof(Testing)}");
        _adminFucomaPassword = _config.GetValue<string>("EntraID:Authority") ?? throw new ArgumentNullException($"Null value for AdminFucomaPassword in {nameof(Testing)}");
    }

    // Is it used in the CustomWebApplicationFactory before each test?
    // should be because the transient injections makes that in each request
    // a instance of the service/class is createdm so in each creations the
    // method GetUserId() is called
    public static string? GetUserId()
    {
        return _homeAccountId;
    }

    public static CustomWebApplicationFactory GetWebAppFactory()
    {
        return _factory;
    }

    public static async Task SeedAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ManagerContext>();

        // Default Plan      
        dbContext.Plans.Add(new()
        {
            PlanName = "Basic",
            CurrentPrice = 0.0m,
            IsActive = true,
        });

        await dbContext.SaveChangesAsync();
    }

    public static async Task<string> RunAsGeneralUserAsync()
    {
        return await RunAsUserAsync("test@local", "Testing1234!");
    }

    public static async Task<string> RunAsAdministratorAsync()
    {
        return await RunAsUserAsync("administrator@local", "Administrator1234!");
    }

    // Get Azure AD Enternal Token throught MSAL, default lifetime beetwen 60 and 90 minutes
    // https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens
    // More Info use of msal .net: https://learn.microsoft.com/en-us/entra/msal/dotnet/acquiring-tokens/desktop-mobile/username-password-authentication
    public static async Task<string> RunAsUserAsync(string userName, string password)
    {
        string[] scopes =
                [
                    $"api://${_authority}/Manager.Read",
                    $"api://${_authority}/Manager.Write"
                ];

        _azureAD = PublicClientApplicationBuilder.Create(_clientId).WithAuthority(_authority).Build();

        var accounts = await _azureAD.GetAccountsAsync();
        if (accounts.Any())
        {
            foreach (var account in accounts)
            {
                // Remove token for cache first
                await _azureAD.RemoveAsync(account);
            }        
        }

        AuthenticationResult? result = await _azureAD.AcquireTokenByUsernamePassword(scopes, userName, password).ExecuteAsync();
        if (result == null)
        {
            throw new ManagerException("Null result on user AcquireTokenByUsernamePassword");
        }

        _homeAccountId = result.Account.HomeAccountId.Identifier;
        _entraIdAccessToken = result.AccessToken;

        // Add Test User of Entra Id to database
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ManagerContext>();

        var newUserAccount = new UserAccount
        {
            IdentityProviderId = result.Account.HomeAccountId.Identifier,
            DisplayName = "Test DisplayName",
            GivenName = "Test GivenName",
            Country = "Test Country",
            City = "Test City",
        };

        var newSubscription = new Domain.Entities.Subscription()
        {
            CurrentPlanId = 1,
            DateSubscribed = DateTime.UtcNow,
            ValidTo = DateTime.UtcNow.AddDays(10),
            OfferId = null
        };

        newUserAccount.Subscription = newSubscription;

        dbContext.UserAccounts.Add(newUserAccount);

        await dbContext.SaveChangesAsync();

        return result.Account.HomeAccountId.Identifier;
    }

    public static async Task ResetState()
    {
        try
        {
            await _database.ResetAsync();
        }
        catch (Exception)
        {
        }

        _homeAccountId = null;
    }

    [OneTimeTearDown]
    public async Task RunAfterAnyTests()
    {
        await _database.DisposeAsync();
        await _factory.DisposeAsync();

        // Remove cache of test AD User
        var account = await _azureAD.GetAccountAsync(_homeAccountId);
        if (account != null)
        {
            await _azureAD.RemoveAsync(account);
        }
    }
}