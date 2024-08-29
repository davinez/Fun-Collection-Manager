namespace Manager.Application.CollectionGroups.Queries.GetCollectionGroupById;

public class CollectionGroupDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool HasCollections { get; set; }
}
