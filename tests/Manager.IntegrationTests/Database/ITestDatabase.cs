using System.Threading.Tasks;

namespace Manager.FunctionalTests.Database;

public interface ITestDatabase
{
    Task InitialiseAsync();
    string GetHostname();
    int GetPort();
    Task DisposeAsync();
}
