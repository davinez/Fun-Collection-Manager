using System.Threading.Tasks;

namespace Manager.Application.Common.Interfaces.Services;

public interface IPlaywrightService
{
    public Task InitializePlaywrightAsync();
}
