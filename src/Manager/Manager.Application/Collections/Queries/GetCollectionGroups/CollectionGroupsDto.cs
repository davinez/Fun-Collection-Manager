using System;
using System.Collections.Generic;

namespace Manager.Application.CollectionsGroups.Queries.GetCollectionGroups;

public class CollectionGroupsDto
{
    public int AllBookmarksCounter { get; set; }
    public int TrashCounter { get; set; }
    public IReadOnlyCollection<CollectionGroupDto> Groups { get; set; } = Array.Empty<CollectionGroupDto>();
}
