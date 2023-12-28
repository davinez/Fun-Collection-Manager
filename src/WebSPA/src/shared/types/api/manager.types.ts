import * as z from "zod";

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
  bookmarksCounter: number;
  childCollections: TCollection[] | undefined;
}

export const groupFormPayload = z.object({
  groupId: z
  .number()
  .min(1, { message: "Invalid group id" })
  .optional(),
	groupName: z
  .string()
  .trim()
  .min(1, { message: "Group is required" })
});

export type TGroupPayload = z.infer<typeof groupFormPayload>;

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
  .url({message: "URL address format is required"}) 
});

export type TAddURLPayload = z.infer<typeof addURLFormPayload>;
