using System.Threading.Tasks;

namespace Manager.FunctionalTests;

public static class TestDatabaseFactory
{
    public static async Task<ITestDatabase> CreateAsync()
    {

        //if DEBUG
        //var database = new PostgresSqlTestDatabase();
        var database = new TestcontainersTestDatabase();


        await database.InitialiseAsync();

        return database;
    }
}
