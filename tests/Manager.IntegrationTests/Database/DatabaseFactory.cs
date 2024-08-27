using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Manager.FunctionalTests.Database;

public static class DatabaseFactory
{
    public static async Task<ITestDatabase> CreateAsync(IConfiguration configuration)
    {
        //if DEBUG
        //var database = new PostgresDatabase();
        var database = new TestContainerDatabase(configuration);

        await database.InitialiseAsync();

        return database;
    }
}
