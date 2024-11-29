using System.Threading.Tasks;

namespace Manager.IntegrationTests.Database;

public static class DatabaseFactory
{
    public static async Task<ITestDatabase> CreateAsync()
    {
        //if DEBUG
        //var database = new PostgresDatabase();
        var database = new TestContainerDatabase();

        await database.InitialiseAsync();

        return database;
    }
}
