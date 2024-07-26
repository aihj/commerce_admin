'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { TablePagination as TablePaginationMui } from '@mui/material';

interface ProductsPaginationProps<T> {
  cSearchParams: T;
  setCSearchParams: () => T;
  totalCount: number;
}

const TablePagination = <T extends object>({
  totalCount,
  cSearchParams,
  setCSearchParams,
}: ProductsPaginationProps<T>): React.JSX.Element => {
  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCSearchParams({ rowsPerPage: event.target.value });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCSearchParams({ currentPage: event.target.value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <TablePaginationMui
      component="div"
      count={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      page={cSearchParams.currentPage}
      rowsPerPage={cSearchParams.rowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
};

export { TablePagination };
