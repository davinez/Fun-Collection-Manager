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
            .RequireAuthorization("All")
            .MapPost(CreateUserAccount)
            .MapGet(GetUserAccountByIdP);
    }

    /// <summary>
    /// Route GET /accounts
    /// </summary>
    public async Task<ApiResponse<UserAccountDto>> GetUserAccountByIdP(
       // [FromHeader(Name = "x-requestid")] Guid requestId,
       // [FromRoute] int groupId, /car/{id}/model
       // [AsParameters] UserSearchQuery query https://github.com/dotnet/aspnetcore/issues/42438
       [FromServices] ISender sender,
       [FromQuery(Name = "identity_provider_id")] string identityProviderId
       )
    {
        var data = await sender.Send(new GetUserAccountByIdPQuery() { IdentityProviderId = identityProviderId });

        return new ApiResponse<UserAccountDto>
        {
            Data = data
        };
    }

    /// <summary>
    /// Route POST /accounts
    /// </summary>
    public async Task<IResult> CreateUserAccount(
        [FromServices] ISender sender,
        [FromBody] CreateUserAccountCommand command
        )
    {

        await sender.Send(command);

        return Results.NoContent();
    }
}
