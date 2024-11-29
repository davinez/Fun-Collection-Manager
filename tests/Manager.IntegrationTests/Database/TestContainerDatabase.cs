using System.Threading.Tasks;
using DotNet.Testcontainers.Builders;
using Testcontainers.PostgreSql;

namespace Manager.IntegrationTests.Database;

public class TestContainerDatabase : ITestDatabase
{
    private readonly PostgreSqlContainer _container;

    public TestContainerDatabase()
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

    public string GetHostname()
    {
        return _container.Hostname;
    }

    public int GetPort()
    {
        return _container.GetMappedPublicPort(5432);
    }

    public async Task DisposeAsync()
    {
        await _container.DisposeAsync();
    }
}
