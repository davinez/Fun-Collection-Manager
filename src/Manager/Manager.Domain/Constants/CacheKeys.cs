namespace Manager.Domain.Constants;

public abstract class CacheKeys
{
    /// <summary>
    /// Gets the cache key for collections groups / sidebar data, with {0}
    /// as user.HomeAccountId
    /// </summary>
    public const string CollectionGroups = "collectiongroups:{0}";
}
