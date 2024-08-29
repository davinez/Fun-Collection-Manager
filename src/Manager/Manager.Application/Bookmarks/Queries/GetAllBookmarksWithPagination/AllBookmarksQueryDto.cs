using System;

namespace Manager.Application.Bookmarks.Queries.GetAllBookmarksWithPagination;

public class AllBookmarksQueryDto
{
    // Bookmark Info
    public int BookmarkId { get; set; }
    public string? BookmarkCover { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? WebsiteUrl { get; set; }
    public DateTimeOffset BookmarkCreatedAt { get; set; }
    // Collection Info
    public int CollectionId { get; set; }
    public string? CollectionIcon { get; set; }
    public string? CollectionName { get; set; }  
}

