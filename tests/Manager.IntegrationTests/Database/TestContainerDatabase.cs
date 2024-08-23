using System.Data.Common;
using System.Threading.Tasks;
using DotNet.Testcontainers.Builders;
using Manager.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Respawn;
using Respawn.Graph;
using SkiaSharp;
using Testcontainers.PostgreSql;

namespace Manager.FunctionalTests.Database;

public class TestContainerDatabase : ITestDatabase
{
    private readonly PostgreSqlContainer _container;
    private DbConnection _connection = null!;
    private string _connectionString = null!;
    private Respawner _respawner = null!;

    public TestContainerDatabase()
    {
        _container = new PostgreSqlBuilder()
            // Change this to same version as your production database!
            .WithImage("postgres:latest")
            .WithDatabase("manager")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .WithWaitStrategy(Wait.ForUnixContainer().UntilCommandIsCompleted("pg_isready"))
            .WithCleanUp(true)
            .Build();
    }

    public async Task InitialiseAsync()
    {
        await _container.StartAsync();

        _connectionString = _container.GetConnectionString();

        _connection = new SqlConnection(_connectionString);
    }

    public async Task InitialiseRespawnAsyn()
    {
        // Config Respawn
        _respawner = await Respawner.CreateAsync(_connectionString, new RespawnerOptions
        {
            TablesToIgnore = new Respawn.Graph.Table[] {
                 new Table("manager", "__EFMigrationsHistory"),
                 new Table("manager", "plan")          
            }
        });
    }

    public DbConnection GetConnection()
    {
        return _connection;
    }

    public async Task ResetAsync()
    {
        await _respawner.ResetAsync(_connectionString);
    }

    public async Task DisposeAsync()
    {
        await _connection.DisposeAsync();
        await _container.DisposeAsync();
    }
}
