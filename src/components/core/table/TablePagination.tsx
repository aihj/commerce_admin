'use client';

import * as React from 'react';
import { TablePagination as TablePaginationMui } from '@mui/material';
import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface ProductsPaginationProps {
  count: number;
}

const TablePagination = ({
  count,
}: ProductsPaginationProps): React.JSX.Element => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // 현재 내가 보고 있는 페이지 변경하기
  const handleChangePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('currentPage', page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [router]
  );

  // 페이지당 몇개의 rows를 보여줄 것인지 변경하기
  const onRowsPerPageChange = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('rowsPerPage', e.target.value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router]
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
