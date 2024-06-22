using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Collections.Queries.GetCollectionById;
using Manager.Application.Collections.Queries.GetCollectionGroups;
using Manager.Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class Collections : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization("All")
            .MapGet(GetCollectionGroups,"by-groups")
            .MapGet(GetCollectionById, "{id}");
    }

    public async Task<ApiResponse<CollectionGroupsDto>> GetCollectionGroups(
        // [FromHeader(Name = "x-requestid")] Guid requestId,
        // [FromRoute] int groupId, /car/{id}/model
        // [AsParameters] UserSearchQuery query https://github.com/dotnet/aspnetcore/issues/42438
        [FromServices] ISender sender
        )
    {
        var data = await sender.Send(new GetCollectionGroupsQuery());

        return new ApiResponse<CollectionGroupsDto>
        {
            Data = data
        };
    }

    public async Task<ApiResponse<CollectionDto>> GetCollectionById([FromServices] ISender sender, int id)
    {
        var data = await sender.Send(new GetCollectionByIdQuery() { Id = id });

        return new ApiResponse<CollectionDto>
        {
            Data = data
        };
    }

}
