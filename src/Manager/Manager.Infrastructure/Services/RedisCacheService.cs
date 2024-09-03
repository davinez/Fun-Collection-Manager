using System;
using System.Text.Json;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Caching.Distributed;

namespace Manager.Infrastructure.Services;

// https://learn.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-8.0
// https://code-maze.com/csharp-web-application-caching-redis/

public class RedisCacheService : IRedisCacheService
{
    private readonly IDistributedCache _cache;

    public RedisCacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<T?> GetCachedItem<T>(string key)
    {
        var jsonData = await _cache.GetStringAsync(key);

        if (jsonData == null)
            return default(T);

        return JsonSerializer.Deserialize<T>(jsonData);
    }

    public async Task SaveItem<T>(string key, T data, TimeSpan cacheDuration)
    {
        // Expire management
        // https://code-maze.com/csharp-web-application-caching-redis/
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20),
            SlidingExpiration = TimeSpan.FromMinutes(4)
        };

        var jsonData = JsonSerializer.Serialize(data);

        await _cache.SetStringAsync(key, jsonData, options);
    }

    public async Task RemoveItem(string key)
    {
        await _cache.RemoveAsync(key);
    }

}
