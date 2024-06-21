using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.CollectionGroups.Commands.CreateCollectionGroup;
using Manager.Application.CollectionGroups.Queries.GetCollectionGroupById;
using Manager.Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class CollectionGroups : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization("All")
            .MapGet(GetCollectionGroupById, "{id}")
            .MapPost(CreateCollectionGroup);
    }

    public async Task<ApiResponse<CollectionGroupDto>> GetCollectionGroupById([FromServices] ISender sender, int id)
    {
        var data = await sender.Send(new GetCollectionGroupByIdQuery() { Id = id });

        return new ApiResponse<CollectionGroupDto>
        {
            Data = data
        };
    }

    public async Task<int> CreateCollectionGroup(
    // [FromHeader(Name = "x-requestid")] Guid requestId,
    // [FromRoute] int groupId, /car/{id}/model
    // [AsParameters] UserSearchQuery query https://github.com/dotnet/aspnetcore/issues/42438
    [FromServices] ISender sender,
    [FromBody] CreateCollectionGroupCommand command
    )
    {
        return await sender.Send(command);
    }

}

