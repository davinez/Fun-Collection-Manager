namespace Manager.Application.Collections.Queries.GetCollectionById;

public class CollectionDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool HasBookmarks { get; set; }
    public bool HasCollections { get; set; }

}
