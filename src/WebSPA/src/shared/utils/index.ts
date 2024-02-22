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
  //
  const initialNodes = groups.flatMap((group) => {
    return group.collections;
  });

  //
  const getIds = (nodes: TCollection[]): number[] =>
    nodes
      .map((collection) => {
        return collection.childCollections.length > 0
          ? [collection.id, ...getIds(collection.childCollections)]
          : [];
      })
      .flat();

  //
  return getIds(initialNodes).map((id) => ({
    nodeId: id,
    isOpen: false,
  }));
}
