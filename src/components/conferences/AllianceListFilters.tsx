'use client';

import React, { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { PATH } from '@/paths';
import { FilterButton } from '@/components/core/FilterButton';
import { SearchParamsType } from '@/app/(afterLogin)/test/mui-table/page';
import TableFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';

interface EnterpriseListFiltersProps {
  filters?: SearchParamsType;
}

const AllianceListFilters = ({
  filters = {},
}: EnterpriseListFiltersProps): JSX.Element => {
  const {
    committeeName,
    // conferenceName,
    // conferenceStartT,
    // conferenceStringIdx,
  } = filters;
  const searchParams = useSearchParams();
  const router = useRouter();

  // const [value, setValue] = useState<string>('');

  const onChangeSelect = useCallback(
    (_selected: any) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set([_selected.name], _selected.value);
      router.push(`${PATH.CONFERENCE.ALLIANCE.LIST}?${params.toString()}`);
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

    router.push(`${PATH.CONFERENCE.ALLIANCE.LIST}?${params.toString()}`);
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
            displayValue={committeeName || undefined}
            label="사무국"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'committeeName', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'committeeName', value: null });
            }}
            popover={<TableFilterPopover title="사무국 이름으로 검색" />}
            // popover={null}
            value={committeeName || undefined}
          />
          {hasFilters(filters) ? (
            <Button onClick={handleClearFilters}>Clear filters</Button>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};
export { AllianceListFilters };
