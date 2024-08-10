using System;

namespace Manager.Application.Common.Dtos;

public class BookmarkDetailDto
{
    public CollectionDetailDto? CollectionDetail { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
