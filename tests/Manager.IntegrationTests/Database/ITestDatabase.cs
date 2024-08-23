using System.Data.Common;
using System.Threading.Tasks;

namespace Manager.FunctionalTests.Database;

public interface ITestDatabase
{
    Task InitialiseAsync();

    Task InitialiseRespawnAsyn();

    DbConnection GetConnection();

    Task ResetAsync();

    Task DisposeAsync();
}
