using System;
using System.Collections.Generic;

namespace Manager.Application.Collections.Queries.GetCollectionGroups;

public class CollectionGroupsDto
{
    public int AllBookmarksCounter { get; set; }
    public int TrashCounter { get; set; }
    public IEnumerable<CollectionGroupDto> Groups { get; set; } = Array.Empty<CollectionGroupDto>();
}
