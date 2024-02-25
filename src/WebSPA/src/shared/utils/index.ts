import type {
	TCollectionGroup,
	TCollection,
	TDynamicCollapseState
} from "@/shared/types/api/manager.types";

export const bytesToMegaBytes = (sizeInBytes: number) => {
return sizeInBytes / (1024 * 1024);
}

export const renderNodesState = (
  groups: TCollectionGroup[]
): TDynamicCollapseState[] => {
  // Concat in one array the collections from all groups
  const initialNodes = groups.flatMap((group) => {
    return group.collections;
  });

  // Get all ids from root to nested collections
  const getIds = (nodes: TCollection[]): number[] =>
    nodes
      .map((collection) => {
        return collection.childCollections.length > 0
          ? [collection.id, ...getIds(collection.childCollections)]
          : [];
      })
      .flat();

  // From final arrays of ids return the array of objects 
  // with each id having its state object
  return getIds(initialNodes).map((id) => ({
    nodeId: id,
    isOpen: false,
  }));
}
