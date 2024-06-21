using System;
using System.Collections.Generic;

namespace Manager.Application.CollectionsGroups.Queries.GetCollectionGroups;

public class CollectionGroupDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public IEnumerable<CollectionDto> Collections { get; set; } = [];
}
