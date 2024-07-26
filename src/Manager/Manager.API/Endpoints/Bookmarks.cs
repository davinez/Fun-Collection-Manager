using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Bookmarks.Commands.CreateBookmark;
using Manager.Application.Bookmarks.Queries.GetAllBookmarksWithPagination;
using Manager.Application.Common.Models;
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

    public async Task<ApiResponse<GetAllBookmarksDto>> GetAllBookmarksWithPagination(
        [FromServices] ISender sender,
        [AsParameters] GetAllBookmarksWithPaginationQuery query
        )
    {
        var data = await sender.Send(query);

        return new ApiResponse<GetAllBookmarksDto>
        {
            Data = data
        };
    }


}
