namespace Manager.Application.Common.Dtos;

public class BookmarkDto
{
    public int Id { get; set; }
    public string? Cover { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string WebsiteURL { get; set; }
    public required BookmarkDetailDto BookmarkDetail { get; set; }
}
