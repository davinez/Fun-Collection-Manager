import * as z from "zod";

export type TNewCollection = {
  id: number;
  name: string;
}

export type TGetCollections = {
  allBookmarksCounter: number;
  trashCounter: number;
  bookmarksCounter: number;
  collections: TCollection[] | undefined
}

export type TCollection = {
  id: number;
  name: string;
  bookmarksCounter: number;
  childCollections: TCollection[] | undefined
}

export const addURLFormPayload = z.object({
	newURL: z
  .string()
  .min(11, { message: "URL address is required" })
  .url({message: "URL address format is required"}) 
});

export type TAddURLPayload = z.infer<typeof addURLFormPayload>;
