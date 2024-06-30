using System.Threading.Tasks;
using Manager.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Playwright;

namespace Manager.Application.Services;

public class PlaywrightService : IPlaywrightService
{
    private readonly IConfiguration _configuration;

    public IPlaywright? _playwrightContext { get; private set; }
    public IBrowser? _browser { get; private set; }

    public PlaywrightService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task InitializePlaywrightAsync()
    {
        _playwrightContext = await Playwright.CreateAsync();
        _browser = await _playwrightContext.Chromium.LaunchAsync();
    }

}
