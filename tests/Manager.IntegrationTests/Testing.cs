using System;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Manager.Domain.Entities;
using Manager.FunctionalTests.Database;
using Manager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Client;
using Npgsql;
using NUnit.Framework;
using Respawn;
using Respawn.Graph;

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
    private static Respawner _respawner = null!;
    private static DbConnection _dbConnection = null!;
    private static CustomWebApplicationFactory _factory = null!;
    private IConfiguration _config = null!;

    // Auth Azure Entra ID
    private static IPublicClientApplication _azureAD = null!;
    private static string? _homeAccountId = null!;
    public static string? _entraIdAccessToken = null!;

    private static string _authority = null!;
    private static string _tenantId = null!;
    private static string _clientIdTestApp = null!;

    //private static string _accessToken = null!;
    //private static string _refreshToken = null!;
    private static string _adminFucomaUsername = null!;
    private static string _adminFucomaPassword = null!;
    private static string _generalFucomaUsername = null!;
    private static string _generalFucomaPassword = null!;


    [OneTimeSetUp]
    public async Task RunBeforeAnyTests()
    {
        try
        {
            // Database
            _database = await DatabaseFactory.CreateAsync();

            // App Factory
            _factory = new CustomWebApplicationFactory(_database);
            _config = _factory.Services.GetService<IConfiguration>() ?? throw new ArgumentNullException($"Null IConfig Service in {nameof(Testing)}");

            // Migrations
            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ManagerContext>();

            if ((await dbContext.Database.GetPendingMigrationsAsync()).Any())
            {
                await dbContext.Database.MigrateAsync();
            }

            await InitialiseRespawnAsyn();

            // Seeding
            await SeedAsync();

            // Config Values
            _authority = _config.GetValue<string>("EntraIDAuthConfig:Instance") ?? throw new ArgumentNullException($"Null value for Authority in {nameof(Testing)}");
            _tenantId = _config.GetValue<string>("EntraID:ManagerApiApp:TenantId") ?? throw new ArgumentNullException($"Null value for TenantId in {nameof(Testing)}");
            _clientIdTestApp = _config.GetValue<string>("EntraID:Testing:ManagerTestApp:ClientId") ?? throw new ArgumentNullException($"Null value for ClientId in {nameof(Testing)}");

            //_accessToken = _config.GetValue<string>("EntraID:Testing:AccessToken") ?? throw new ArgumentNullException($"Null value for Access Token in {nameof(Testing)}");
            //_refreshToken = _config.GetValue<string>("EntraID:Testing:RefreshToken") ?? throw new ArgumentNullException($"Null value for Refresh Token in {nameof(Testing)}");
            _adminFucomaUsername = _config.GetValue<string>("EntraID:Testing:AdminUser:Email") ?? throw new ArgumentNullException($"Null value for AdminFucomaUsername in {nameof(Testing)}");
            _adminFucomaPassword = _config.GetValue<string>("EntraID:Testing:AdminUser:Password") ?? throw new ArgumentNullException($"Null value for AdminFucomaPassword in {nameof(Testing)}");
            _generalFucomaUsername = _config.GetValue<string>("EntraID:Testing:GeneralUser:Email") ?? throw new ArgumentNullException($"Null value for GeneralFucomaUsername in {nameof(Testing)}");
            _generalFucomaPassword = _config.GetValue<string>("EntraID:Testing:GeneralUser:Password") ?? throw new ArgumentNullException($"Null value for GeneralFucomaPassword in {nameof(Testing)}");

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            throw;
        }
    }

    private async Task InitialiseRespawnAsyn()
    {
        var host = _database.GetHostname();
        var port = _database.GetPort();
        var connectionString = $"Server={host};Port={port};Database=ManagerDB;User Id=postgres;Password=postgres";

        _dbConnection = new NpgsqlConnection(connectionString);

        await _dbConnection.OpenAsync();

        // Config Respawn
        _respawner = await Respawner.CreateAsync(_dbConnection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            TablesToIgnore = new Respawn.Graph.Table[] {
                 new Table("manager", "__EFMigrationsHistory"),
                 new Table("manager", "plan")
            }
        });

        await _dbConnection.CloseAsync();
    }

    private static async Task ResetDatabaseAsync()
    {
        await _dbConnection.OpenAsync();
        await _respawner.ResetAsync(_dbConnection);
        await _dbConnection.CloseAsync();
    }

    // Is it used in the CustomWebApplicationFactory before each test?
    // should be because the transient injections makes that in each request
    // a instance of the service/class is created so in each creations the
    // method GetUserId() is called
    public static string? GetUserId()
    {
        return _homeAccountId;
    }

    public static string? GetAccessToken()
    {
        return _homeAccountId;
    }

    public static CustomWebApplicationFactory GetWebAppFactory()
    {
        return _factory;
    }

    public static ManagerContext GetDbContext()
    {
        var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<ManagerContext>();

        return dbContext;
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
        return await RunAsUserAsync(_adminFucomaUsername, _adminFucomaPassword);
    }

    public static async Task<string> RunAsAdministratorAsync()
    {
        return await RunAsUserAsync(_generalFucomaUsername, _generalFucomaPassword);
    }

    // Get Azure AD Enternal Token throught MSAL, default lifetime beetwen 60 and 90 minutes
    // https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens
    // More Info use of msal .net: https://learn.microsoft.com/en-us/entra/msal/dotnet/acquiring-tokens/desktop-mobile/username-password-authentication
    public static async Task<string> RunAsUserAsync(string userName, string password)
    {
        //string[] scopes =
        //        [
        //            $"api://${_clientId}/Manager.Read",
        //            $"api://${_clientId}/Manager.Write"
        //        ];

        string[] scopes =
               [
                   "user.read"
               ];

        _azureAD = PublicClientApplicationBuilder.Create(_clientIdTestApp).WithAuthority(_authority).Build();

        var accounts = await _azureAD.GetAccountsAsync();
        if (accounts.Any())
        {
            foreach (var account in accounts)
            {
                // Remove token for cache first
                await _azureAD.RemoveAsync(account);
            }
        }

        AuthenticationResult? result;

        try
        {
            result = await _azureAD.AcquireTokenByUsernamePassword(scopes, userName, password).ExecuteAsync();

            _homeAccountId = result.Account.HomeAccountId.Identifier;

            string[] scopesManagerAPI =
                  [
                  "api://156687b4-4e89-4f20-b99a-97120bab635f/Manager.Read",
                  "api://156687b4-4e89-4f20-b99a-97120bab635f/Manager.Write"
                  ];

            result = await _azureAD.AcquireTokenSilent(scopesManagerAPI, result.Account).ExecuteAsync();

        }
        catch (MsalException ex)
        {
            Console.WriteLine(ex.ToString());
            throw;
        }

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
            await ResetDatabaseAsync();
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
        await _dbConnection.DisposeAsync();

        // Remove cache of test AD User
        var account = await _azureAD.GetAccountAsync(_homeAccountId);
        if (account != null)
        {
            await _azureAD.RemoveAsync(account);
        }
    }
}
