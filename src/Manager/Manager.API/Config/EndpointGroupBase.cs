using Microsoft.AspNetCore.Builder;

namespace Manager.API.Config;

public abstract class EndpointGroupBase
{
    public abstract void Map(WebApplication app);
}
