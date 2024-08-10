using System.Collections.Generic;
using Manager.Application.Common.Dtos;

namespace Manager.Application.Bookmarks.Queries.GetBookmarksByCollectionWithPagination;

public class GetBookmarksByCollectionDto
{
    public required IEnumerable<BookmarkDto> Bookmarks { get; set; }
    public int Total { get; set; }
    public required string CollectionName { get; set; }
}
