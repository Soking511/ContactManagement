import { Query, QueryOptions } from "mongoose";
import { PaginationResult } from "./interfaces/featuresInterface";

export class Features {
  constructor(
    private query: Query<any[], any>,
    private queryString: QueryOptions
  ) {}

  paginate(documentsCount: number) {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.max(Number(this.queryString.limit) || 5, 1);
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(documentsCount / limit);

    this.query = this.query.skip(skip).limit(limit);

    const pagination: PaginationResult = {
      currentPage: page,
      limit,
      totalPages,
      totalDocuments: documentsCount,
      nextPage: page + 1 > totalPages ? page : page + 1,
      prevPage: page - 1 < 1 ? page : page - 1,
    };

    return {
      pagination,
      query: this.query,
    };
  }
}
