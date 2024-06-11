using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Accounts.Commands.CreateUserAccount;
using Manager.Application.Accounts.Queries.GetUserAccountByIdP;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class Accounts : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .AllowAnonymous()
            .MapPost(CreateUserAccount);
    }

    public async Task GetUserAccountByIdP(
       [FromServices] ISender sender,
       [AsParameters] GetUserAccountByIdPQuery query
       )
    {
        await sender.Send(query);
    }

    public async Task CreateUserAccount(
        [FromServices] ISender sender,
        [FromBody] CreateUserAccountCommand command
        )
    {

        await sender.Send(command);
    }
}
