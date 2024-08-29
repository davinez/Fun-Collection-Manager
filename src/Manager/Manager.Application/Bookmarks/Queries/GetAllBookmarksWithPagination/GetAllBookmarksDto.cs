using System.Collections.Generic;
using Manager.Application.Common.Dtos;

namespace Manager.Application.Bookmarks.Queries.GetAllBookmarksWithPagination;

public class GetAllBookmarksDto
{
    public required IEnumerable<BookmarkDto> Bookmarks { get; set; }
    public int Total { get; set; }
}
