using System.Buffers;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Dtos;
using Manager.Application.Common.Enums;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Helpers;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Manager.Application.Bookmarks.Queries.GetAllBookmarksWithPagination;

public record GetAllBookmarksWithPaginationQuery : IRequest<GetAllBookmarksDto>
{
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


public class GetAllBookmarksWithPaginationQueryHandler : IRequestHandler<GetAllBookmarksWithPaginationQuery, GetAllBookmarksDto>
{
    private readonly ILogger<GetAllBookmarksWithPaginationQuery> _logger;

    private readonly IUser _user;
    private readonly IManagerReadDbConnection _connection;
    private readonly IManagerContext _context;

    public GetAllBookmarksWithPaginationQueryHandler(ILogger<GetAllBookmarksWithPaginationQuery> logger, IUser user, IManagerReadDbConnection connection, IManagerContext context)
    {
        _logger = logger;

        _user = user;
        _connection = connection;
        _context = context;
    }

    public async Task<GetAllBookmarksDto> Handle(GetAllBookmarksWithPaginationQuery request, CancellationToken cancellationToken)
    {
        // Generate SQL Query with only the 2 specified columns
        // AnonymousType
        var userAccount = await _context.UserAccounts
           .AsNoTracking()
           .Select(c => new { c.Id, c.IdentityProviderId })
           .FirstOrDefaultAsync(u => u.IdentityProviderId.Equals(_user.HomeAccountId));

        Guard.Against.NotFound(_user.HomeAccountId, userAccount);

        string sortValue = EnumHelpers.GetSortValue(request.SortType);

        (string whereCondition, object[] whereArgs) = EnumHelpers.GetFilterBookmarkValue(request.FilterType, request.SearchValue);

        /* 
         ----SQL Variables----
         -user_account_id
        */

        int totalRecords = await (from cg in _context.CollectionGroups
                                  join c in _context.Collections on cg.Id equals c.CollectionGroupId
                                  join b in _context.Bookmarks on c.Id equals b.CollectionId
                                  where cg.UserAccountId == userAccount.Id
                                  orderby b.Id
                                  select b) // Generates Query SELECT count(*) 
                                  .CountAsync(cancellationToken: cancellationToken);

        var bookmarks = await (from cg in _context.CollectionGroups
                               join c in _context.Collections on cg.Id equals c.CollectionGroupId
                               join b in _context.Bookmarks on c.Id equals b.CollectionId
                               where cg.UserAccountId == userAccount.Id
                               select new AllBookmarksQueryDto()
                               {
                                   BookmarkId = b.Id,
                                   BookmarkCover = b.Cover,
                                   Title = b.Title,
                                   Description = b.Description,
                                   WebsiteUrl = b.WebsiteUrl,
                                   CreatedAt = b.Created,
                                   CollectionId = c.Id,
                                   CollectionIcon = c.Icon,
                                   CollectionName = c.Name,
                                   CollectionCreatedAt = c.Created,
                               }
                   )
                   .OrderBy(sortValue)
                   .Skip((request.Page - 1) * request.PageLimit)
                   .Take(request.PageLimit)
                   .Where(whereCondition, whereArgs)
                   .AsNoTracking()
                   .ToListAsync(cancellationToken: cancellationToken);

        var response = new GetAllBookmarksDto()
        {
            Total = totalRecords,
            Bookmarks = bookmarks.Select(b => new BookmarkDto()
            {
                Id = b.BookmarkId,
                Cover = b.BookmarkCover,
                Title = b.Title,
                Description = b.Description,
                WebsiteURL = b.WebsiteUrl,
                BookmarkDetail = new BookmarkDetailDto()
                {
                    CollectionDetail = new CollectionDetailDto()
                    {
                        Icon = b.CollectionIcon,
                        Name = b.CollectionName ?? throw new ManagerException($"Null CollectionName")
                    },
                    CreatedAt = b.CollectionCreatedAt,
                }
            })
        };

        return response;
    }

}


