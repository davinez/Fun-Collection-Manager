using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Accounts.Commands.CreateUserAccount;
using Manager.Application.Accounts.Queries.GetUserAccountByIdP;
using Manager.Application.Common.Models;
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
            .MapPost(CreateUserAccount)
            .MapGet(GetUserAccountByIdP);
    }

    public async Task<ApiResponse<UserAccountDto>> GetUserAccountByIdP(
       [FromServices] ISender sender,
       [AsParameters] GetUserAccountByIdPQuery query
       )
    {
        var data = await sender.Send(query);

        return new ApiResponse<UserAccountDto>
        {
            Data = data
        };
    }

    public async Task<IResult> CreateUserAccount(
        [FromServices] ISender sender,
        [FromBody] CreateUserAccountCommand command
        )
    {

        await sender.Send(command);

        return Results.NoContent();
    }
}
