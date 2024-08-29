using System.Collections.Generic;

namespace Manager.Application.Collections.Queries.GetCollectionGroups;

public class CollectionGroupDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public IEnumerable<CollectionNodeDto>? Collections { get; set; }
}
