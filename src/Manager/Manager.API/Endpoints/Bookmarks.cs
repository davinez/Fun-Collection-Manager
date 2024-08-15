using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Bookmarks.Commands.CreateBookmark;
using Manager.Application.Bookmarks.Commands.DeleteBookmarks;
using Manager.Application.Bookmarks.Commands.PatchBookmark;
using Manager.Application.Bookmarks.Queries.GetAllBookmarksWithPagination;
using Manager.Application.Bookmarks.Queries.GetBookmarksByCollectionWithPagination;
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
           .MapPost(CreateBookmark)
           .MapPatch(PatchBookmark, "{id}")
           .MapGet(GetAllBookmarksWithPagination, "all")
           .MapGet(GetBookmarksByCollectionWithPagination, "by-collection/{id}")
           .MapDelete(DeleteBookmarks, "list");
    }

    public async Task<IResult> CreateBookmark([FromServices] ISender sender, [FromBody] CreateBookmarkCommand command)
    {
        await sender.Send(command);

        return Results.NoContent();
    }

    public async Task<IResult> PatchBookmark([FromServices] ISender sender, int id, [FromForm] PatchBookmarkCommand command)
    {
        command.CollectionId = id;

        await sender.Send(command);

        return Results.NoContent();
    }


    public async Task<ApiResponse<GetAllBookmarksDto>> GetAllBookmarksWithPagination(
        [FromServices] ISender sender,
        [AsParameters] GetAllBookmarksWithPaginationQuery query
        )
    {
        // Pre-process query
        query.SearchValue = query.SearchValue?.Trim();

        var data = await sender.Send(query);

        return new ApiResponse<GetAllBookmarksDto>
        {
            Data = data
        };
    }

    public async Task<ApiResponse<GetBookmarksByCollectionDto>> GetBookmarksByCollectionWithPagination(
        [FromServices] ISender sender,
        [AsParameters] GetBookmarksByCollectionWithPaginationQuery query,
        [FromRoute] int id
        )
    {
        // Pre-process query
        query.SearchValue = query.SearchValue?.Trim();
        query.CollectionId = id;

        var data = await sender.Send(query);

        return new ApiResponse<GetBookmarksByCollectionDto>
        {
            Data = data
        };
    }

    public async Task<IResult> DeleteBookmarks([FromServices] ISender sender, [FromBody] DeleteBookmarksCommand command)
    {
        await sender.Send(command);

        return Results.NoContent();
    }


}
