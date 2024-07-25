using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Manager.Application.Common.Dtos.Services.ManagerSupportService;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace Manager.Infrastructure.Services;

public class ManagerSupportService : IManagerSupportService
{
    private readonly HttpClient _client;

    public ManagerSupportService(IConfiguration configuration, HttpClient client)
    {
        _client = client;
        _client.BaseAddress = new Uri(configuration["S3Storage:BucketBookmarksCovers"] ?? throw new ManagerException($"Empty config section in {nameof(CreateBookmark)} bookmarks bucket"));
       // _client.Timeout = new TimeSpan(0, 0, 30);
        _client.DefaultRequestHeaders.Clear();     
    }

    public async Task<BookmarkDataDto> GetBookmarkData(string webUrl)
    {
        using (var response = await _client.PostAsync("/scrapper/bookmark"))
        {
            response.EnsureSuccessStatusCode();
            var stream = await response.Content.ReadAsStreamAsync();
            var companies = await JsonSerializer.DeserializeAsync<List<CompanyDto>>(stream, _options);
            return companies;
        }
    }
}
