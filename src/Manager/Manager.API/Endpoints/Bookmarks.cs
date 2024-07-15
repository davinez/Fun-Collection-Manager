using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Bookmarks.Commands.CreateBookmark;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class Bookmarks : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
           .RequireAuthorization("All")
           .MapPost(CreateBookmark);
    }

    public async Task<IResult> CreateBookmark([FromServices] ISender sender, [FromBody] CreateBookmarkCommand command)
    {
        await sender.Send(command);

        return Results.NoContent();
    }


}
