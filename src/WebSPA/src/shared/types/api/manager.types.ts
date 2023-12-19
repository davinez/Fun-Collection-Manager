import * as z from "zod";

export type TNewCollection = {
  id: number;
  name: string;
}

export type TChildCollection = {
  id: number;
  name: string;
  childCollections: TChildCollection[]
}

export type TGetCollections = {
  id: number;
  name: string;
  childCollections: TChildCollection[]
}

export const addURLFormPayload = z.object({
	newURL: z
  .string()
  .min(11, { message: "URL address is required" })
  .url({message: "URL address format is required"}) 
});

export type TAddURLPayload = z.infer<typeof addURLFormPayload>;
