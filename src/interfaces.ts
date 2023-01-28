export interface iData {
  name: string;
  quantity: string;
}

export interface iList {
  listName: string;
  data: iData[];
  id?: number;
}

export type tListRequiredKeys = "listName" | "data";
export type tListRequiredValues = "string" | "object";

export type tDataRequiredKeys = "name" | "quantity";
