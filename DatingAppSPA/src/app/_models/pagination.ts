
  export interface pagination
  {
    currentPAge: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  }

  export class PaginatedResult<T> {
  result: T;
  pagination: pagination;
  }
