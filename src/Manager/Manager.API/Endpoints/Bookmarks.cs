using System;
using System.Threading.Tasks;
using Manager.API.Config;
using Manager.API.Config.Extensions;
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
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Web;

namespace Manager.API.Endpoints;

public class Bookmarks : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
       // string[] scopesClaim = app.Configuration.GetSection("EntraIDAuthConfig:Scopes").Get<string[]>() ?? throw new ArgumentNullException($"Null value for Scopes in {nameof(CollectionGroups)}");

        app.MapGroup(this)
           .RequireAuthorization("All")
           .MapPost(CreateBookmark)
           .MapPatch(PatchBookmark, "{id}", true)
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
        command.BookmarkId = id;

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
