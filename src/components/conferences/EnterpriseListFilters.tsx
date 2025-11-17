'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { PATH } from '@/paths';
import { FilterButton } from '@/components/core/FilterButton';
import { SearchParamsType } from '@/app/(afterLogin)/test/mui-table/page';
import TableTextFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import { TableDateFilterPopover } from '@/components/core/table/filter/TableDateFilterPopover';

interface EnterpriseListFiltersProps {
  filters?: SearchParamsType;
}

const EnterpriseListFilters = ({
  filters = {},
}: EnterpriseListFiltersProps): JSX.Element => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // const [value, setValue] = useState<string>('');

  const onChangeSelect = useCallback(
    (_selected: any) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set([_selected.name], _selected.value);
      router.push(`${PATH.CONFERENCE.ENTERPRISE.LIST}?${params.toString()}`);
    },
    [router, searchParams]
  );

  // 검색 초기화
  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    console.log('params', params);

    // 모든 매개변수를 삭제
    const keysToDelete = Array.from(params.keys());
    console.log('params keysToDelete', keysToDelete);
    keysToDelete.forEach((key) => {
      params.delete(key);
    });

    router.push(`${PATH.CONFERENCE.ENTERPRISE.LIST}?${params.toString()}`);
  }, [router, searchParams]);

  const hasFilters = (filters: any): boolean => {
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        // if (filters.hasOwnProperty(key)) {
        // 필수는 아님
        if (filters[key] !== undefined && filters[key] !== null) {
          return true; // 하나의 값이라도 undefined나 null이 아니면 true 반환
        }
      }
    }
    return false; // 모든 값이 undefined 또는 null일 경우 false 반환
  };

  const clientOpenStatusFilterData = useMemo(
    () => [
      { value: 'active', label: '활성화' },
      { value: 'inactive', label: '비활성화' },
    ],
    []
  );
  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}
        >
          <FilterButton
            displayValue={filters.conferenceStartT || undefined}
            label="학회 시작 날짜"
            onFilterApply={(value) => {
              onChangeSelect({
                name: 'conferenceStartT',
                value,
              });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'conferenceStartT', value: null });
            }}
            popover={
              <TableDateFilterPopover
                format="YYYY-MM-DD"
                title="학회 시작 날짜로 검색"
              />
            }
            value={filters.conferenceStartT || undefined}
          />
          <FilterButton
            displayValue={filters.conferenceEndT || undefined}
            label="학회 종료 날짜"
            onFilterApply={(value) => {
              onChangeSelect({
                name: 'conferenceEndT',
                value,
              });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'conferenceEndT', value: null });
            }}
            popover={
              <TableDateFilterPopover
                format="YYYY-MM-DD"
                title="학회 종료 날짜로 검색"
              />
            }
            value={filters.conferenceEndT || undefined}
          />

          <FilterButton
            displayValue={filters.committeeName || undefined}
            label="사무국"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'committeeName', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'committeeName', value: null });
            }}
            popover={<TableTextFilterPopover title="사무국 이름으로 검색" />}
            value={filters.committeeName || undefined}
          />

          <FilterButton
            displayValue={filters.clientOpenStatus || undefined}
            label="Client 페이지 Open 여부"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'clientOpenStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'clientOpenStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={clientOpenStatusFilterData}
              />
            }
            value={filters.clientOpenStatus || undefined}
          />

          {hasFilters(filters) ? (
            <Button onClick={handleClearFilters}>Clear filters</Button>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};
export { EnterpriseListFilters };
