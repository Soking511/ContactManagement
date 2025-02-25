export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
  [key: string]: any;
}

export interface PaginationResult {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalDocuments: number;
  nextPage: number;
  prevPage: number;
}
