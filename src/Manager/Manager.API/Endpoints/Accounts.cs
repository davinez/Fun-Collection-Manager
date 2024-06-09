using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.CollectionsGroups.Commands.CreateCollectionGroup;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class Accounts : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(CreateUserAccount);
    }

    public async Task<int> CreateUserAccount(
        [FromServices] ISender sender,
        [FromBody] CreateCollectionGroupCommand command
        )
    {
        return await sender.Send(command);
    }
}
