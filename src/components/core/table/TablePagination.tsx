'use client';

import * as React from 'react';
import { TablePagination as TablePaginationMui } from '@mui/material';
import { useCallback } from 'react';
import { PATH } from '@/paths';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface ProductsPaginationProps {
  count: number;
}

const TablePagination = ({
  count,
}: ProductsPaginationProps): React.JSX.Element => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // 현재 내가 보고 있는 페이지 변경하기
  const handleChangePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('currentPage', page);
      router.push(`${PATH.TEST.MUI_TABLE}?${params.toString()}`);
    },
    [searchParams, router]
  );

  // 페이지당 몇개의 rows를 보여줄 것인지 변경하기
  const onRowsPerPageChange = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
      console.log(e.target.value);
      const params = new URLSearchParams(searchParams.toString());
      params.set('rowsPerPage', e.target.value);
      router.push(`${PATH.TEST.MUI_TABLE}?${params.toString()}`);
    },
    [searchParams, router]
  );
  // -------------------------------------------------------------------------------------
  return (
    <TablePaginationMui
      component="div"
      count={count}
      onPageChange={(e, page) => handleChangePage(page)}
      onRowsPerPageChange={(e) => onRowsPerPageChange(e)}
      page={searchParams.get('currentPage') || 0}
      rowsPerPage={searchParams.get('rowsPerPage') || 10}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
};

export { TablePagination };
