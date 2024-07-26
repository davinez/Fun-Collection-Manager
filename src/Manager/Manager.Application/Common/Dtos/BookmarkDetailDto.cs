namespace Manager.Application.Common.Dtos;

public class BookmarkDetailDto
{
    public required CollectionDetailDto CollectionDetail { get; set; }
    public required string CreatedAt { get; set; }
}
