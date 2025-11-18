import { TableSearchParams } from '@/api/types/tableSearchParams';

export const rowsPerPageOptions = [10, 20, 50, 100];

const InitSearchParam = (
  conferenceIdx: number | null,
  sortType: string,
  sortDir?: 'desc' | 'asc',
  rowsPerPage?: number
): TableSearchParams => {
  return {
    conferenceIdx: conferenceIdx as number,
    currentPage: 0,
    rowsPerPage: rowsPerPage ? rowsPerPage : rowsPerPageOptions[1],

    sortType: sortType,
    sortDir: sortDir ? sortDir : 'desc',
  };
};

export { InitSearchParam };
