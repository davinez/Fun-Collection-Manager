using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Collections.Queries.GetCollectionGroups;
using Manager.Application.Common.Enums;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Manager.Application.Bookmarks.Queries.GetAllBookmarksWithPagination;

public record GetAllBookmarksWithPaginationQuery : IRequest<GetAllBookmarksDto>
{
    public int Page { get; set; }
    public int PageLimit { get; set; }
    public FilterBookmarksEnum? FilterType { get; set; }
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
        _logger.LogInformation("Manager Request: {Name} {@UserId} - {@Request}",
          nameof(GetCollectionGroupsQuery), _user.HomeAccountId, request);

        var userAccount = await _context.UserAccounts
           .AsNoTracking()
           .FirstOrDefaultAsync(u => u.IdentityProviderId.Equals(_user.HomeAccountId));

        Guard.Against.NotFound(_user.HomeAccountId, userAccount);

        // ----Variables----

        //  --user_account_id

        var parameters = new { UserAccountId = userAccount.Id };

        string sql = $@"";

        var collections = await _connection.QueryAsync<CollectionsGroupsQueryDto>(sql, parameters, null, cancellationToken);

        var response = new CollectionGroupsDto()
        {
            AllBookmarksCounter = collections.Sum(c => c.BookmarksCounter),
            TrashCounter = 0,
            Groups = collections
            .GroupBy(g => new { g.GroupId, g.GroupName })
            .Select(group =>
            {
                return new CollectionGroupDto()
                {
                    Id = group.Key.GroupId,
                    Name = group.Key.GroupName,
                    // Check if first row in GroupBy is null meaning that group doesnt have collections / is empty
                    Collections = group.First().CollectionId == 0 ? null : group.ToArray().GenerateTreeWithRecursion(c => c.CollectionId, c => c.ParentNodeId)
                };
            }).ToList()
        };

        return response;
    }
}


