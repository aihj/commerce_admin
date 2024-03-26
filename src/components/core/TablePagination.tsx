'use client';

import * as React from 'react';
import { TablePagination as TablePaginationMui } from '@mui/material';

function noop(): void {
  return undefined;
}

interface ProductsPaginationProps {
  count: number;
  page: number;
}

const TablePagination = ({
  count,
  page,
}: ProductsPaginationProps): React.JSX.Element => {
  // You should implement the pagination using a similar logic as the filters.
  // Note that when page change, you should keep the filter search params.

  return (
    <TablePaginationMui
      component="div"
      count={count}
      onPageChange={noop}
      onRowsPerPageChange={noop}
      page={page}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
};

export { TablePagination };
