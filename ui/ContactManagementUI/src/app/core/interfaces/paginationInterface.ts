export interface IPagination {
  currentPage: number;
  totalDocuments: number;
  totalPages: number;
  limit: number;
  skip: number;
}
