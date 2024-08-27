using System.Data.Common;
using System.Threading.Tasks;

namespace Manager.FunctionalTests.Database;

public interface ITestDatabase
{
    Task InitialiseAsync();

    Task InitialiseRespawnAsyn();

    Task ResetAsync();

    Task DisposeAsync();
}
