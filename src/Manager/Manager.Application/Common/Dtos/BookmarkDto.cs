namespace Manager.Application.Common.Dtos;

public class BookmarkDto
{
    public int Id { get; set; }
    public string? Cover { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? WebsiteURL { get; set; }
    public required BookmarkDetailDto BookmarkDetail { get; set; }
}
