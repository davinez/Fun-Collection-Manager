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

export type TAddURLPayload = {
  url: string;
}
