using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Collections.Commands.CreateCollection;
using Manager.Application.Collections.Commands.DeleteCollection;
using Manager.Application.Collections.Commands.UpdateCollection;
using Manager.Application.Collections.Queries.GetCollectionById;
using Manager.Application.Collections.Queries.GetCollectionGroups;
using Manager.Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class Collections : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization("All")
            .MapGet(GetCollectionGroups, "by-groups")
            .MapGet(GetCollectionById, "{id}")
            .MapPost(CreateCollection)
            .MapPatch(PatchCollection, "{id}")
            .MapDelete(DeleteCollection, "{id}");
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

    public async Task<IResult> CreateCollection([FromServices] ISender sender, [FromBody] CreateCollectionCommand command)
    {
        await sender.Send(command);
        return Results.NoContent();
    }

    public async Task<IResult> PatchCollection([FromServices] ISender sender, int id, [FromBody] PatchCollectionCommand command)
    {
        command.CollectionId = id;

        await sender.Send(command);

        return Results.NoContent();
    }

    public async Task<IResult> DeleteCollection([FromServices] ISender sender, int id)
    {
        await sender.Send(new DeleteCollectionCommand() { CollectionId = id});

        return Results.NoContent();
    }


}
