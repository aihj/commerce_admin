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
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rowsPerPage = Number(event.target.value);
      logger.debug(
        '<onRowsPerPageChange> rowsPerPage : ',
        rowsPerPage
      );
      console.log('onRowsPerPageChange called with rowsPerPage:', rowsPerPage);
      setCSearchParamsFunc({ rowsPerPage });
    },
    [setCSearchParamsFunc]
  );

  const onPageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      logger.debug('<onPageChange> page : ', page);
      console.log('onPageChange called with page:', page);
      setCSearchParamsFunc({ currentPage: page });
    },
    [setCSearchParamsFunc]
  );
  if (!cSearchParams || totalCount === undefined) {
    console.log('TablePagination: cSearchParams 또는 totalCount가 없음', { cSearchParams, totalCount });
    return null;
  }
  
  // 타입 안전성을 위해 타입 단언 사용
  const currentPage = (cSearchParams as any).currentPage ?? 0;
  const rowsPerPage = (cSearchParams as any).rowsPerPage ?? 10;
  
  console.log('TablePagination 렌더링:', {
    totalCount,
    currentPage,
    rowsPerPage,
    count: totalCount,
  });
  
  return (
    <TablePaginationMui
      component="div"
      count={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      page={currentPage}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
};

export { TablePagination };
