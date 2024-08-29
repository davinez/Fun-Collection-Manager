using System;
using System.Collections.Generic;
using System.Linq;
using Manager.Application.Collections.Queries.GetCollectionGroups;

namespace Manager.Application.Common.Helpers.Tree;

public static class TreeHelpers
{
    /// <summary>
    /// Generates tree of items from item list
    /// </summary>
    /// 
    /// <typeparam name="T">Type of item in collection</typeparam>
    /// <typeparam name="K">Type of parent_id</typeparam>
    /// 
    /// <param name="flatTree">Collection of items to generate the tree</param>
    /// <param name="id_selector">Function extracting item's id</param>
    /// <param name="parent_id_selector">Function extracting item's parent_id</param>
    /// <param name="id_to_match">Root element id</param>
    /// 
    /// <returns>Tree of items</returns>
    public static IEnumerable<CollectionNodeDto> GenerateTreeWithRecursion(
    this CollectionsGroupsQueryDto[] flatTree,
    Func<CollectionsGroupsQueryDto, int> id_selector,
    Func<CollectionsGroupsQueryDto, int> parent_id_selector,
    int id_to_match = default)
    {
        foreach (var c in flatTree.Where(c => EqualityComparer<int>.Default.Equals(parent_id_selector(c), id_to_match)))
        {
            yield return new CollectionNodeDto
            {

                Id = c.CollectionId,
                Name = c.CollectionName,
                Icon = c.CollectionIcon,
                BookmarksCounter = c.BookmarksCounter,
                ParentNodeId = c.ParentNodeId,
                ChildCollections = flatTree.GenerateTreeWithRecursion(id_selector, parent_id_selector, id_selector(c))
            };
        }
    }

}
