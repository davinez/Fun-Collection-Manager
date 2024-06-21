﻿namespace Manager.Application.CollectionsGroups.Queries.GetCollectionGroups;

public class CollectionsGroupsQueryDto
{
    public int CollectionId { get; set; }
    public string? CollectionName { get; set; }
    public string? CollectionIcon { get; set; }
    public int ParentNodeId { get; set; }
    public int CollectionGroupId { get; set; }
    public string? GroupName { get; set; }
    public int BookmarksCounter { get; set; }
}