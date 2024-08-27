using System.Threading.Tasks;
using DotNet.Testcontainers.Builders;
using Microsoft.Extensions.Configuration;
using Respawn;
using Respawn.Graph;
using Testcontainers.PostgreSql;

namespace Manager.FunctionalTests.Database;

public class TestContainerDatabase : ITestDatabase
{
    private readonly PostgreSqlContainer _container;
    private Respawner _respawner = null!;

    public TestContainerDatabase(IConfiguration configuration)
    {
        _container = new PostgreSqlBuilder()
            // Change this to same version as your production database!
            .WithImage("postgres:latest")
            .WithDatabase("ManagerDB")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .WithWaitStrategy(Wait.ForUnixContainer().UntilCommandIsCompleted("pg_isready"))
            .WithCleanUp(true)
            .Build();
    }

    public async Task InitialiseAsync()
    {
        await _container.StartAsync();
    }

    public async Task InitialiseRespawnAsyn()
    {
        string connectionString = _container.GetConnectionString();

        // Config Respawn
        _respawner = await Respawner.CreateAsync(connectionString, new RespawnerOptions
        {
            TablesToIgnore = new Respawn.Graph.Table[] {
                 new Table("manager", "__EFMigrationsHistory"),
                 new Table("manager", "plan")
            }
        });
    }

    public async Task ResetAsync()
    {
        string connectionString = _container.GetConnectionString();

        await _respawner.ResetAsync(connectionString);
    }

    public async Task DisposeAsync()
    {
        await _container.DisposeAsync();
    }
}
