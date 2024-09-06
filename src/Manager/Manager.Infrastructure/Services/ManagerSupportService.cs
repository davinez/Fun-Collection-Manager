using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Manager.Application.Common.Dtos.Services.ManagerSupportService;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces.Services;
using Manager.Application.Common.Models;
using Microsoft.Extensions.Configuration;

namespace Manager.Infrastructure.Services;

public class ManagerSupportService : IManagerSupportService
{
    private readonly HttpClient _client;
    private readonly JsonSerializerOptions _options;

    public ManagerSupportService(IConfiguration configuration, HttpClient client)
    {
        _client = client;
        _client.BaseAddress = new Uri(configuration["ManagerSupportService:BaseAddress"] ?? throw new ManagerException($"Empty config section in {nameof(ManagerSupportService)} BaseAdress"));
        // _client.Timeout = new TimeSpan(0, 0, 30);
        _client.DefaultRequestHeaders.Clear();

        _client.DefaultRequestHeaders.Add("x-api-key", configuration["ManagerSupportService:ApiKey"] ?? throw new ManagerException($"Empty config section in {nameof(ManagerSupportService)} Api Key"));

        _options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, PropertyNameCaseInsensitive = false };
    }

    public async Task<BookmarkDataDto> GetBookmarkData(string webUrl)
    {
        var requestJson = JsonSerializer.Serialize(new { webUrl });

        using StringContent jsonContent = new(
        requestJson,
        Encoding.UTF8,
        "application/json"
        );

        using var response = await _client.PostAsync("/scrapper/bookmark", jsonContent);

        if (!response.IsSuccessStatusCode)
            throw new RemoteServiceException(nameof(ManagerSupportService), $"Error: {response.StatusCode} Message: {response.ReasonPhrase} Request: {requestJson}");

        var responseJson = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<ApiResponse<BookmarkDataDto>>(responseJson, _options) ?? throw new RemoteServiceException(nameof(ManagerSupportService), $"Error in deserialize response for {responseJson}");

        return data.Data ?? throw new RemoteServiceException(nameof(ManagerSupportService), $"Null Data Api Response Wrapper for request {requestJson}");
    }
}
