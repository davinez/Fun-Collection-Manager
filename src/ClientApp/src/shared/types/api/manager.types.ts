import * as z from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "shared/config";
import { bytesToMegaBytes } from "shared/utils";

// Components Types //

export type TDynamicCollapseState = {
  nodeId: number;
  isOpen: boolean;
};


// API/Service Types //

export type TGetCollectionGroups = {
  allBookmarksCounter: number;
  groups: TCollectionGroup[];
}

export type TCollectionGroup = {
  id: number;
  name: string;
  collections: TCollection[];
}

export type TCollection = {
  id: number;
  name: string;
  icon: string;
  bookmarksCounter: number;
  childCollections: TCollection[];
}

export type TGroupInfo = {
  id: number;
  name: string;
  hasCollections: boolean;
}

export type TCollectionInfo = {
  id: number;
  name: string;
  hasBookmarks: boolean;
  hasCollections: boolean;
}

export type TGetAllBookmarks = {
  bookmarks: TBookmark[];
  total: number;
}

export type TGetBookmarksByCollection = {
  bookmarks: TBookmark[];
  total: number;
  collectionName: string;
}

export type TBookmark = {
  id: number;
  cover: string;
  title: string;
  description: string;
  websiteURL: string;
  bookmarkDetail: TBookmarkDetail;
}

type TBookmarkDetail = {
  collectionDetail?: { icon: string, name: string };
  createdAt: string;
}

export type TGetCollectionsAllIcons = {
  items: IconsGroupCollections[]
}

type IconsGroupCollections = {
  title: string;
  icons: {
    name: string;
    url: string;
  }[];
}


// Form Types //

export const groupAddFormPayload = z.object({
  groupName: z
    .string()
    .trim()
    .min(1, { message: "Group is required" })
});
export type TGroupAddPayload = z.infer<typeof groupAddFormPayload>;

export const groupUpdateFormPayload = z.object({
  groupName: z
    .string()
    .trim()
    .min(1, { message: "Group is required" })
});
export type TGroupUpdatePayload = z.infer<typeof groupUpdateFormPayload>;

export const deleteGroupFormPayload = z.object({
  groupId: z
    .number()
    .min(1, { message: "Invalid group id" })
});
export type TDeleteGroupPayload = z.infer<typeof deleteGroupFormPayload>;

export const addURLFormPayload = z.object({
  newURL: z
    .string()
    .min(11, { message: "URL address is required" })
    .url({ message: "URL address format is required" })
});
export type TAddURLPayload = z.infer<typeof addURLFormPayload>;

export const bookmarkUpdateFormPayload = z.object({
  cover: z
    .custom<FileList>()
    // .refine((files) => {
    //   console.log(files);
    //   return Array.from(files ?? []).length !== 0;
    // }, "Image is required")
    .refine((files) => {
      if (Array.from(files ?? []).length === 0) // Only validate if a file exists
        return true;
      return Array.from(files ?? []).every(
        (file) => bytesToMegaBytes(file.size) <= MAX_IMAGE_SIZE
      );
    }, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
    .refine((files) => {
      if (Array.from(files ?? []).length === 0) // Only validate if a file exists
        return true;
      return Array.from(files ?? []).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type)
      );
    }, "File type is not supported")
    .optional()
    .or(z.literal('')), // cover?: "" | FileList | undefined;
  title: z
    .string()
    .min(2, { message: "Title is required" }),
  description: z
    .string()
    .min(2, { message: "Description is required" }),
  websiteURL: z
    .string()
    .min(11, { message: "URL address is required" })
    .url({ message: "URL address format is required" })
});
export type TBookmarkUpdatePayload = z.infer<typeof bookmarkUpdateFormPayload>;

export const bookmarkDeleteFormPayload = z.object({
  bookmarkIds: z
    .custom<number[]>()
    .refine((ids) => {
      return ids.length < 1 ? false : true;
    }, "Empty Payload")
    .refine((ids) => {
      return ids.every((id) => id > 0);
    }, "Invalid Ids")
});
export type TBookmarkDeletePayload = z.infer<typeof bookmarkDeleteFormPayload>;

export const collectionAddFormPayload = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "name is required" }),
});

export type TCollectionAddFormPayload = z.infer<typeof collectionAddFormPayload>;

export type TCollectionAddExtrasPayload = {
  icon: string;
  groupId: number;
  parentCollectionId: number | undefined;
}

export const collectionUpdateFormPayload = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Collection is required" })
});
export type TCollectionUpdateFormPayload = z.infer<typeof collectionUpdateFormPayload>;

export const collectionUpdateIconFormPayload = z.object({
  iconURL: z
    .string()
    .trim()
    .min(1, { message: "URL is required" })
});
export type TCollectionUpdateIconFormPayload = z.infer<typeof collectionUpdateIconFormPayload>;

export const deleteCollectionFormPayload = z.object({
  collectionId: z
    .number()
    .min(1, { message: "Invalid group id" })
});
export type TDeleteCollectionPayload = z.infer<typeof deleteCollectionFormPayload>;


// Query Params Types //

export type TGetBookmarksParams = {
  page: number;
  pageLimit: number;
  filterType: string;
  debounceSearchValue: string;
}

