export interface PagyMeta {
  count: number;
  page: number;
  limit: number;
  pages: number;
  last: number;
  next: number | null;
  prev: number | null;
  from: number;
  to: number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PagyMeta;
}