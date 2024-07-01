using System.Threading.Tasks;
using Manager.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Playwright;

namespace Manager.Application.Services;

public class PlaywrightService : IPlaywrightService
{
    private readonly IConfiguration _configuration;

    public IPlaywright? PlaywrightContext { get; private set; }
    public IBrowser? Browser { get; private set; } 

    public PlaywrightService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task InitializePlaywrightAsync()
    {
        PlaywrightContext = await Playwright.CreateAsync();
        Browser = await PlaywrightContext.Chromium.LaunchAsync(new() { Headless = true, ChromiumSandbox = true });
    }

}
