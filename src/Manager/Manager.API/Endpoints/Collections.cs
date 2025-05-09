﻿using System.Threading.Tasks;
using Manager.API.Config;
using Manager.API.Config.Extensions;
using Manager.Application.Collections.Commands.ChangeIcon;
using Manager.Application.Collections.Commands.CreateCollection;
using Manager.Application.Collections.Commands.DeleteCollection;
using Manager.Application.Collections.Commands.PatchCollection;
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
            .MapPatch(ChangeIcon, "{id}/icon")
            .MapDelete(DeleteCollection, "{id}");
    }

    public async Task<ApiResponse<CollectionGroupsDto>> GetCollectionGroups([FromServices] ISender sender)
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

    public async Task<IResult> ChangeIcon([FromServices] ISender sender, int id, [FromBody] ChangeIconCommand command)
    {
        command.CollectionId = id;

        await sender.Send(command);

        return Results.NoContent();
    }

    public async Task<IResult> DeleteCollection([FromServices] ISender sender, int id)
    {
        await sender.Send(new DeleteCollectionCommand() { CollectionId = id });

        return Results.NoContent();
    }


}
