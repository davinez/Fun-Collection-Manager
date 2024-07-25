using System.Reflection.Metadata;

namespace Manager.Application.Common.Dtos.Services.ManagerSupportService;

public class BookmarkDataDto
{
    public Blob? PageCover { get; set; }
    public required string PageTitle { get; set; }
    public required string PageDescription { get; set; }
}
