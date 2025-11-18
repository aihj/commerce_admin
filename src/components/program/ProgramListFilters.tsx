'use client';

import React, { useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { PATH } from '@/paths';
import { FilterButton } from '@/components/core/FilterButton';
import { SearchParamsType } from '@/app/(afterLogin)/test/mui-table/page';
import TableTextFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';
import { TableDateFilterPopover } from '@/components/core/table/filter/TableDateFilterPopover';

interface EnterpriseListFiltersProps {
  filters?: SearchParamsType;
}

const ProgramListFilters = ({
  filters = {},
}: EnterpriseListFiltersProps): JSX.Element => {
  const { confStringIdx } = useParams();
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
    // 모든 매개변수를 삭제
    for (const key of params.keys()) {
      params.delete(key);
    }

    router.push(
      `${PATH.EACH.PROGRAM.LIST(confStringIdx)}?${params.toString()}`
    );
  }, [confStringIdx, router, searchParams]);

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
            displayValue={filters.sessionCategoryDate || undefined}
            label="카테고리 날짜"
            onFilterApply={(value) => {
              onChangeSelect({
                name: 'sessionCategoryDate',
                value,
              });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'sessionCategoryDate', value: null });
            }}
            popover={
              <TableDateFilterPopover
                format="YYYY-MM-DD"
                title="카테고리 날짜로 검색"
              />
            }
            value={filters.sessionCategoryDate || undefined}
          />

          <FilterButton
            displayValue={filters.sessionCategoryTitle || undefined}
            label="카테고리 제목"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'sessionCategoryTitle', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'sessionCategoryTitle', value: null });
            }}
            popover={<TableTextFilterPopover title="카테고리 제목으로 검색" />}
            value={filters?.sessionCategoryTitle}
          />

          <FilterButton
            displayValue={filters.sessionGroupTitle || undefined}
            label="세션 제목"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'sessionGroupTitle', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'sessionGroupTitle', value: null });
            }}
            popover={<TableTextFilterPopover title="세션 제목으로 검색" />}
            value={filters.sessionGroupTitle || undefined}
          />

          {hasFilters(filters) ? (
            <Button onClick={handleClearFilters}>Clear filters</Button>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};
export { ProgramListFilters };
