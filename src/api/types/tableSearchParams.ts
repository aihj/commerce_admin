// export type TableSearchParams = { [key: string]: object };

export type TableSearchParams = {
  conferenceIdx: number | null;
  currentPage: number;
  rowsPerPage: number;

  sortType: string; // 어떤 타입을 가지고 정렬 할 것인지
  sortDir: 'asc' | 'desc'; // 어떤 방향으로 정렬할 것인지
  searchText?: string;
};
