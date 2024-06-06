using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Accounts.Commands.OnAttributeCollectionSubmit;
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

    public async Task<OnAttributeCollectionSubmitDto> OnAttributeCollectionSubmit(
        [FromServices] ISender sender,
        [FromBody] OnAttributeCollectionSubmitCommand command
        )
    {
        return await sender.Send(command);
    }

    public async Task<int> CreateUserAccount(
        [FromServices] ISender sender,
        [FromBody] CreateCollectionGroupCommand command
        )
    {
        return await sender.Send(command);
    }
}
