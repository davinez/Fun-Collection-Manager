using System.Threading.Tasks;
using Microsoft.Playwright;

namespace Manager.Application.Common.Interfaces.Services;

public interface IPlaywrightService
{
    public IPlaywright? PlaywrightContext { get; }
    public IBrowser? Browser { get; }
    public Task InitializePlaywrightAsync();
}
