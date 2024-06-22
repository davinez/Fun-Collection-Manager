using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Helpers.Tree;
using Manager.Application.Common.Interfaces;
using MediatR;

namespace Manager.Application.Collections.Queries.GetCollectionGroups;

public record GetCollectionGroupsQuery : IRequest<CollectionGroupsDto>;

public class GetCollectionGroupsQueryHandler : IRequestHandler<GetCollectionGroupsQuery, CollectionGroupsDto>
{

    private readonly IManagerReadDbConnection _connection;

    public GetCollectionGroupsQueryHandler(IManagerReadDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<CollectionGroupsDto> Handle(GetCollectionGroupsQuery request, CancellationToken cancellationToken)
    {

        // ----Variables----

        //  --user_account_id

        var parameters = new { UserAccountId = 4 };

        string sql = $@"WITH RECURSIVE tree (
        collection_id, 
        collection_name, 
        collection_icon, 
        parent_node_id, 
        collection_group_id, 
        group_name
        ) AS
        (
          SELECT 
          c.id as collection_id, 
          c.name as collection_name, 
          c.icon as collection_icon, 
          c.parent_node_id, 
          c.collection_group_id, 
          cg.name as group_name
            FROM manager.collection_group cg   
            INNER JOIN manager.collection c ON c.collection_group_id = cg.id
            WHERE c.parent_node_id IS NULL -- the tree node
            AND cg.user_account_id = @UserAccountId
          UNION ALL
          SELECT 
          c2.id as collection_id, 
          c2.name as collection_name, 
          c2.icon as collection_icon, 
          c2.parent_node_id, 
          c2.collection_group_id,  
          cg.name as group_name
            FROM manager.collection_group cg
            INNER JOIN tree t ON cg.id = t.collection_group_id
            JOIN manager.collection c2 ON t.collection_id = c2.parent_node_id
        ), bookmarks_info (
        collection_id,
        bookmarks_counter
        ) 
        AS (

        SELECT 
        t.collection_id,
        COUNT(b.id) as bookmarks_counter
        FROM manager.bookmark b
        LEFT JOIN tree t ON t.collection_id = b.collection_id
        GROUP BY t.collection_id

        )
        SELECT 
        t.collection_id as ""CollectionId"",
        t.collection_name as ""CollectionName"",
        t.collection_icon as ""CollectionIcon"",
        t.parent_node_id as ""ParentNodeId"",
        t.collection_group_id as ""CollectionGroupId"",
        t.group_name as ""GroupName"",
        CASE
          WHEN b.bookmarks_counter > 0 THEN bookmarks_counter
          ELSE 0
        END 
          AS ""BookmarksCounter""
        FROM tree t
        LEFT JOIN bookmarks_info b ON b.collection_id = t.collection_id;";
        // --ORDER BY t.collection_id;

        var collections = await _connection.QueryAsync<CollectionsGroupsQueryDto>(sql, parameters, null, cancellationToken);

        var response = new CollectionGroupsDto()
        {
            AllBookmarksCounter = collections.Sum(c => c.BookmarksCounter),
            TrashCounter = 0,
            Groups = collections
            .GroupBy(g => new { g.CollectionGroupId, g.GroupName })
            .Select(group =>
            {
                return new CollectionGroupDto()
                {
                    Id = group.Key.CollectionGroupId,
                    Name = group.Key.GroupName,
                    Collections = group.ToArray().GenerateTreeWithRecursion(c => c.CollectionId, c => c.ParentNodeId)
                };
            }).ToList()
        };

        return response;
    }
}

