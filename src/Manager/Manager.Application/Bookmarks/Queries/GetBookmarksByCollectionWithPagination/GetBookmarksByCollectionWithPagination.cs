using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Dtos;
using Manager.Application.Common.Enums;
using Manager.Application.Common.Helpers;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace Manager.Application.Bookmarks.Queries.GetBookmarksByCollectionWithPagination;

public record GetBookmarksByCollectionWithPaginationQuery : IRequest<GetBookmarksByCollectionDto>
{
    // Is provided from route and not url query
    public int? CollectionId { get; set; }


    [JsonConverter(typeof(JsonStringEnumConverter))]
    [FromQuery(Name = "sort_type")]
    public SortEnum SortType { get; set; }


    public int Page { get; set; }


    [FromQuery(Name = "page_limit")]
    public int PageLimit { get; set; }


    [JsonConverter(typeof(JsonStringEnumConverter))]
    [FromQuery(Name = "filter_type")]
    public FilterBookmarksEnum? FilterType { get; set; }


    [FromQuery(Name = "search_value")]
    public string? SearchValue { get; set; }
}


public class GetBookmarksByCollectionWithPaginationQueryHandler : IRequestHandler<GetBookmarksByCollectionWithPaginationQuery, GetBookmarksByCollectionDto>
{
    private readonly ILogger<GetBookmarksByCollectionWithPaginationQuery> _logger;

    private readonly IUser _user;
    private readonly IManagerContext _context;

    public GetBookmarksByCollectionWithPaginationQueryHandler(
        ILogger<GetBookmarksByCollectionWithPaginationQuery> logger, 
        IUser user,
        IManagerContext context)
    {
        _logger = logger;

        _user = user;
        _context = context;
    }

    public async Task<GetBookmarksByCollectionDto> Handle(GetBookmarksByCollectionWithPaginationQuery request, CancellationToken cancellationToken)
    {
        // Generate SQL Query with only the 2 specified columns
        // AnonymousType
        var userAccount = await _context.UserAccounts
           .AsNoTracking()
           .Select(c => new { c.Id, c.IdentityProviderId })
           .FirstOrDefaultAsync(u => u.IdentityProviderId.Equals(_user.HomeAccountId));

        Guard.Against.NotFound(_user.HomeAccountId, userAccount);
    
        string sqlSortValue = EnumHelpers.GetSortValue(request.SortType);

        (string sqlWhereCondition, object[] sqlWhereArgs) = EnumHelpers.GetFilterBookmarkValue(request.FilterType, request.SearchValue);

        /* 
         ----SQL Variables----
         -user_account_id
        */

        var collectionData = await (from cg in _context.CollectionGroups
                                    join c in _context.Collections on cg.Id equals c.CollectionGroupId
                                    join b in _context.Bookmarks on c.Id equals b.CollectionId
                                    where cg.UserAccountId == userAccount.Id && c.Id == request.CollectionId
                                    select new
                                    {
                                        b.Title,
                                        b.Description,
                                        b.WebsiteUrl,
                                        BookmarkCreatedAt = c.Created,
                                        CollectionName = c.Name,
                                    })
                                  .Where(sqlWhereCondition, sqlWhereArgs)
                                  .GroupBy(group => group.CollectionName)
                                  .Select(group => new { CollectionName = group.Key, TotalRecords = group.Count() })
                                  .AsNoTracking()
                                  .FirstOrDefaultAsync(); // Generates Query SELECT count(*) 

        var bookmarks = await (from cg in _context.CollectionGroups
                               join c in _context.Collections on cg.Id equals c.CollectionGroupId
                               join b in _context.Bookmarks on c.Id equals b.CollectionId
                               where cg.UserAccountId == userAccount.Id && c.Id == request.CollectionId
                               select new BookmarksByCollectionQueryDto()
                               {
                                   BookmarkId = b.Id,
                                   BookmarkCover = b.Cover,
                                   Title = b.Title,
                                   Description = b.Description,
                                   WebsiteUrl = b.WebsiteUrl,
                                   BookmarkCreatedAt = b.Created,
                               }
                   )
                   .OrderBy(sqlSortValue)
                   .Skip((request.Page - 1) * request.PageLimit)
                   .Take(request.PageLimit)
                   .Where(sqlWhereCondition, sqlWhereArgs)
                   .AsNoTracking()
                   .ToListAsync(cancellationToken: cancellationToken);

        var response = new GetBookmarksByCollectionDto()
        {
            CollectionName = collectionData != null ? collectionData.CollectionName : string.Empty,
            Total = collectionData != null ? collectionData.TotalRecords : 0,
            Bookmarks = bookmarks.Select(b => new BookmarkDto()
            {
                Id = b.BookmarkId,
                Cover = b.BookmarkCover,
                Title = b.Title,
                Description = b.Description,
                WebsiteURL = b.WebsiteUrl,
                BookmarkDetail = new BookmarkDetailDto()
                {
                    CreatedAt = b.BookmarkCreatedAt,
                }
            })
        };

        return response;
    }

}

