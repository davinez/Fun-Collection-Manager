using System;

namespace Manager.Application.Bookmarks.Queries.GetBookmarksByCollectionWithPagination;

public class BookmarksByCollectionQueryDto
{
    // Bookmark Info
    public int BookmarkId { get; set; }
    public string? BookmarkCover { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? WebsiteUrl { get; set; }
    public DateTimeOffset BookmarkCreatedAt { get; set; }
}
