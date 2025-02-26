export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
  [key: string]: any;
}

