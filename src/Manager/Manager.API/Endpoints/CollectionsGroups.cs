using System;
using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.CollectionsGroups.Commands.CreateCollectionGroup;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class CollectionsGroups : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(CreateCollectionGroup);
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
