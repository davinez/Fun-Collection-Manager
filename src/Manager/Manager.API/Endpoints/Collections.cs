using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.CollectionGroups.Commands.CreateCollectionGroup;
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
            .MapGet(GetCollectionGroups, "by-groups");
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

}
