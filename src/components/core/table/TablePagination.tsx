'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { TablePagination as TablePaginationMui } from '@mui/material';
import { logger } from '@/lib/logger/defaultLogger';

interface ProductsPaginationProps<T> {
  cSearchParams: T;
  setCSearchParamsFunc: (parma: any) => any;
  totalCount: number;
}

const TablePagination = <T extends object>({
  totalCount,
  cSearchParams,
  setCSearchParamsFunc,
}: ProductsPaginationProps<T>) => {
  window.cSearchParams = cSearchParams;

  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      logger.debug(
        '<onRowsPerPageChange> event.target.value : ',
        event.target.value
      );

      setCSearchParamsFunc({ rowsPerPage: event.target.value });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, _page: number) => {
      let page = event.target.value;
      if (event.target.value === undefined) page = _page;
      logger.debug('<onPageChange> page : ', page);
      setCSearchParamsFunc({ currentPage: page || 0 });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (!cSearchParams || totalCount === undefined) return null;
  return (
    <TablePaginationMui
      component="div"
      count={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      page={cSearchParams.currentPage}
      rowsPerPage={cSearchParams.rowsPerPage}
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
    />
  );
};

export { TablePagination };
