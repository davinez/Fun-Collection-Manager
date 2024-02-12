import * as z from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "shared/config";
import { bytesToMegaBytes } from "shared/utils";

export type TNewCollection = {
  id: number;
  name: string;
}

export type TGetCollectionGroups = {
  allBookmarksCounter: number;
  trashCounter: number;
  groups: TCollectionGroup[] | undefined;
}

export type TCollectionGroup = {
  id: number;
  name: string;
  collections: TCollection[] | undefined;
}

export type TCollection = {
  id: number;
  name: string;
  cover: string;
  bookmarksCounter: number;
  childCollections: TCollection[] | undefined;
}

export type TGroup = {
  id: number;
  name: string;
}

export type TBookmark = {
  id: number;
  cover: string;
  title: string;
  description: string;
  bookmarkDetail: TBookmarkDetail;
}

type TBookmarkDetail = {
  collection: { id: number, icon: string, name: string };
  websiteURL: string;
  createdAt: string;
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
  groupId: z
    .number()
    .min(1, { message: "Invalid group id" }),
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

