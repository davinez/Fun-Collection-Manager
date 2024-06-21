using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Manager.Application.CollectionsGroups.Queries.GetCollectionGroups;

public class CollectionDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Icon { get; set; }
    public int BookmarksCounter { get; set; }
    [JsonIgnore]
    public int ParentNodeId { get; set; }
    public IEnumerable<CollectionDto> ChildCollections { get; set; } = Array.Empty<CollectionDto>();
}
