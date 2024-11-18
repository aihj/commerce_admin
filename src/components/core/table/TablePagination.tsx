// @ts-nocheck
'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { TablePagination as TablePaginationMui } from '@mui/material';
import { logger } from '@/lib/logger/defaultLogger';
import { rowsPerPageOptions } from '@/lib/InitSearchParams';

interface PaginationProps<T> {
  cSearchParams: T;
  setCSearchParamsFunc: (parma: any) => any;
  totalCount: number;
}

const TablePagination = <T extends object>({
  totalCount,
  cSearchParams,
  setCSearchParamsFunc,
}: PaginationProps<T>) => {
  // window.cSearchParams = cSearchParams;

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
      // 이 조건이 있으면 event.target.value가 ''이 되는 시점에 페이지네이션이 제대로 동작하지 않음
      // 이 조건이 왜 있는지, event.target.value가 ''이 되는 시점은 언제인지 명확하지 않아서 주석처리로 남김
      // if (event.target.value === undefined)
      page = _page;
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
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
};

export { TablePagination };
