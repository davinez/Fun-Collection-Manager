using Microsoft.AspNetCore.Builder;

namespace Manager.API.Infrastructure;

public abstract class EndpointGroupBase
{
    public abstract void Map(WebApplication app);
}
