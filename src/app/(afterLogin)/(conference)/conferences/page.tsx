import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { paths } from '@/paths';
import { ProductModal } from '@/components/dashboard/product/product-modal';
import type { Filters } from '@/components/dashboard/product/products-filters';
import { ProductsFilters } from '@/components/dashboard/product/products-filters';
import { ProductsPagination } from '@/components/dashboard/product/products-pagination';
import { ProductsTable } from '@/components/dashboard/product/products-table';
import type { Product } from '@/components/dashboard/product/products-table';
import { Conference } from '@/types/type';

const conferences: Conference[] = [
  {
    conferenceIdx: 1,
    conferenceStringIdx: 'aaa',
    conferenceName: 'aaa',
    conferenceDesc: 'aaa',
    conferenceStartT: new Date(),
    conferenceEndT: new Date(),
    conferencePreRegiStartT: new Date(),
    conferencePreRegiEndT: new Date(),
    conferenceRegistrationT: new Date(),
    conferenceApplyType: 'pre',
    essentialCredit: 10,
    electiveCredit: 10,
    isOnline: 0,
    homeUrl: 'https://pco.medistaff.co.kr',
  },
  {
    conferenceIdx: 2,
    conferenceStringIdx: 'bbb',
    conferenceName: 'bbb',
    conferenceDesc: 'bbb',
    conferenceStartT: new Date(),
    conferenceEndT: new Date(),
    conferencePreRegiStartT: new Date(),
    conferencePreRegiEndT: new Date(),
    conferenceRegistrationT: new Date(),
    conferenceApplyType: 'pre',
    essentialCredit: 10,
    electiveCredit: 10,
    isOnline: 1,
    homeUrl: 'https://pco.medistaff.co.kr',
  },
  {
    conferenceIdx: 3,
    conferenceStringIdx: 'ccc',
    conferenceName: 'ccc',
    conferenceDesc: 'ccc',
    conferenceStartT: new Date(),
    conferenceEndT: new Date(),
    conferencePreRegiStartT: new Date(),
    conferencePreRegiEndT: new Date(),
    conferenceRegistrationT: new Date(),
    conferenceApplyType: 'pre',
    essentialCredit: 10,
    electiveCredit: 10,
    isOnline: 0,
    homeUrl: 'https://pco.medistaff.co.kr',
  },
];

// 검색 필터
interface PageProps {
  searchParams: {
    committeeName?: string;
    conferenceName?: string;
    isOnline: 0 | 1;
    sortDirection?: 'asc' | 'desc';
  };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { committeeName, conferenceName, isOnline, sortDirection } =
    searchParams;

  // TODO: 이건 클라이언트에서 정렬을 하는 방법, 실제로는 서버에서 정렬해야함
  const orderedItems = applySort(conferences, sortDirection);
  const filteredItems = applyFilters(orderedItems, {
    committeeName,
    conferenceName,
    isOnline,
  });

  return (
    <React.Fragment>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ alignItems: 'flex-start' }}
          >
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Products</Typography>
            </Box>
            <div>
              <Button
                component={RouterLink}
                href={paths.dashboard.products.create}
                startIcon={<PlusIcon />}
                variant="contained"
              >
                Add
              </Button>
            </div>
          </Stack>
          <Card>
            <ProductsFilters
              filters={{ category, sku, status }}
              sortDir={sortDir}
            />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <ProductsTable rows={filteredItems} />
            </Box>
            <Divider />
            <ProductsPagination count={filteredItems.length} page={0} />
          </Card>
        </Stack>
      </Box>
      <ProductModal open={Boolean(previewId)} />
    </React.Fragment>
  );
}

// Sorting and filtering has to be done on the server.

function applySort(
  row: Conference[],
  sortDirection: 'asc' | 'desc' | undefined
): Conference[] {
  return row.sort((a, b) => {
    if (sortDirection === 'asc') {
      return (
        a.conferenceRegistrationT.getTime() -
        b.conferenceRegistrationT.getTime()
      );
    }

    return (
      b.conferenceRegistrationT.getTime() - a.conferenceRegistrationT.getTime()
    );
  });
}

function applyFilters(
  row: Conference[],
  { category, status, sku }: Filters
): Product[] {
  return row.filter((item) => {
    if (category) {
      if (item.category !== category) {
        return false;
      }
    }

    if (status) {
      if (item.status !== status) {
        return false;
      }
    }

    if (sku) {
      if (!item.sku?.toLowerCase().includes(sku.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
