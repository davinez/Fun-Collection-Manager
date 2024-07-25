using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.CollectionGroups.Commands.CreateCollectionGroup;
using Manager.Application.CollectionGroups.Commands.DeleteCollectionGroup;
using Manager.Application.CollectionGroups.Commands.PatchCollectionGroup;
using Manager.Application.CollectionGroups.Queries.GetCollectionGroupById;
using Manager.Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

[RouteGroupName("collection-groups")]
public class CollectionGroups : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization("All")
            .MapGet(GetCollectionGroupById, "{id}")
            .MapPost(CreateCollectionGroup)
            .MapPatch(PatchCollectionGroup, "{id}")
            .MapDelete(DeleteCollectionGroup, "{id}");
    }

    public async Task<ApiResponse<CollectionGroupDto>> GetCollectionGroupById([FromServices] ISender sender, int id)
    {
        var data = await sender.Send(new GetCollectionGroupByIdQuery() { Id = id });

        return new ApiResponse<CollectionGroupDto>
        {
            Data = data
        };
    }

    public async Task<IResult> CreateCollectionGroup(
        [FromServices] ISender sender,
        [FromServices] IHttpContextAccessor contextAccessor,
        [FromBody] CreateCollectionGroupCommand command
        )
    {
        await sender.Send(command);

        return Results.NoContent();
    }

    public async Task<IResult> PatchCollectionGroup([FromServices] ISender sender, int id, [FromBody] PatchCollectionGroupCommand command)
    {
        command.GroupId = id;

        await sender.Send(command);

        return Results.NoContent();
    }

    public async Task<IResult> DeleteCollectionGroup([FromServices] ISender sender, int id)
    {
        await sender.Send(new DeleteCollectionGroupCommand() { GroupId = id });

        return Results.NoContent();
    }

}

