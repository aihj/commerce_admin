import { TableSearchParams } from '@/api/types/tableSearchParams';

export const rowsPerPageOptions = [20, 50, 100];

const InitSearchParam = (
  conferenceIdx: number,
  sortType: string,
  sortDir?: 'desc' | 'asc',
  rowsPerPage?: number
): TableSearchParams => {
  return {
    conferenceIdx: conferenceIdx as number,
    currentPage: 0,
    rowsPerPage: rowsPerPage ? rowsPerPage : rowsPerPageOptions[0],

    sortType: sortType,
    sortDir: sortDir ? sortDir : 'desc',
  };
};

export { InitSearchParam };
