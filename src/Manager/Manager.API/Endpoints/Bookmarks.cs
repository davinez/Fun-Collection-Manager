using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;

namespace Manager.API.Endpoints;

public class Bookmarks : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization("All");
        //.MapGet(GetCollectionGroupById, "{id}")
        // .MapPost(CreateCollectionGroup)
        // .MapPatch(PatchCollectionGroup, "{id}")
        // .MapDelete(DeleteCollectionGroup, "{id}");
    }



}
