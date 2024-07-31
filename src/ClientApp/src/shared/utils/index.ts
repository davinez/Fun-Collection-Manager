import type {
  TCollectionGroup,
  TCollection,
  TDynamicCollapseState
} from "@/shared/types/api/manager.types";

export const getEnumKeyByEnumValue = <T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | undefined => {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : undefined;
}

export const isNumber = (value?: string | number): boolean => {
  return ((value != null) &&
    (value !== '') &&
    !isNaN(Number(value.toString())));
}

export const bytesToMegaBytes = (sizeInBytes: number) => {
  return sizeInBytes / (1024 * 1024);
}

export const isValidHttpUrl = (value: string) => {
  let url;
  try {
    url = new URL(value);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const getUrlHostname = (value: string) => {
  let url;
  try {
    url = new URL(value);
  } catch (_) {
    return "http:";
  }

  return url.protocol === "http:" || url.protocol === "https:" ? url.hostname : "http:";
}

export const renderNodesState = (
  groups: TCollectionGroup[]
): TDynamicCollapseState[] => {
  const initialNodes: TCollection[] = groups.flatMap((group) => {
    return group.collections ? (group.collections as TCollection[]) : []
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
  const state = getIds(initialNodes).map((id) => ({
    nodeId: id,
    isOpen: false,
  }));

  return state;
}
