using System;
using System.Threading.Tasks;

namespace Manager.Application.Common.Interfaces.Services;

public interface IRedisCacheService
{
    Task<T?> GetCachedItem<T>(string key);
    Task SaveItem<T>(string key, T data, TimeSpan cacheDuration);
    Task RemoveItem(string key);
}
