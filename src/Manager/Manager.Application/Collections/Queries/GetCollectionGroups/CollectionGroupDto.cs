using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Manager.Application.Collections.Queries.GetCollectionGroups;

public class CollectionGroupDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Icon { get; set; }
    public int BookmarksCounter { get; set; }

    [JsonIgnore]
    public int ParentNodeId { get; set; }

    public IEnumerable<CollectionGroupDto> ChildCollections { get; set; } = Array.Empty<CollectionGroupDto>();
}
