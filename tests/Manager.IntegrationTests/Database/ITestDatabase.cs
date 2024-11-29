using System.Threading.Tasks;

namespace Manager.IntegrationTests.Database;

public interface ITestDatabase
{
    Task InitialiseAsync();
    string GetHostname();
    int GetPort();
    Task DisposeAsync();
}
