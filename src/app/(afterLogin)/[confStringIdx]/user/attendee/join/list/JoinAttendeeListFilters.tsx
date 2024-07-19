'use client';

import React, { useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { PATH } from '@/paths';
import { FilterButton } from '@/components/core/FilterButton';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import { TableDateFilterPopover } from '@/components/core/table/filter/TableDateFilterPopover';
import { JoinAttendeeListSearchParamsType } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/join/list/page';
import TableTextFilter from '@/components/core/table/filter/TableTextFilter';

interface EnterpriseListFiltersProps {
  filters?: JoinAttendeeListSearchParamsType;
}

const JoinAttendeeListFilters = ({
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
      router.push(
        `${PATH.EACH.USER.ATTENDEE.JOIN_LIST(confStringIdx)}?${params.toString()}`
      );
    },
    [confStringIdx, router, searchParams]
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

    router.push(
      `${PATH.EACH.USER.ATTENDEE.JOIN_LIST(confStringIdx)}?${params.toString()}`
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

  const genderFilterData = useMemo(
    () => [
      { value: 'F', label: '여성' },
      { value: 'M', label: '남성' },
    ],
    []
  );
  const registrationStatusData = useMemo(
    () => [
      { value: 'not_registered', label: '미등록' },
      { value: 'pre', label: '사전등록' },
      { value: 'onsite', label: '현장등록' },
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
            displayValue={filters?.birthDateStartT}
            label="생년 시작 년도"
            onFilterApply={(value) => {
              onChangeSelect({
                name: 'birthDateStartT',
                value,
              });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'birthDateStartT', value: null });
            }}
            popover={
              <TableDateFilterPopover
                format="YYYY-MM-DD"
                title="생년 시작 년도로 검색"
              />
            }
            value={filters?.birthDateStartT}
          />
          <FilterButton
            displayValue={filters?.birthDateEndT}
            label="생년 종료 년도"
            onFilterApply={(value) => {
              onChangeSelect({
                name: 'birthDateEndT',
                value,
              });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'birthDateEndT', value: null });
            }}
            popover={
              <TableDateFilterPopover
                format="YYYY-MM-DD"
                title="학회 종료 날짜로 검색"
              />
            }
            value={filters?.birthDateEndT}
          />

          <FilterButton
            displayValue={filters?.gender}
            label="회원 상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'gender', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'gender', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={genderFilterData}
              />
            }
            value={filters?.gender || undefined}
          />

          <FilterButton
            displayValue={filters?.gender}
            label="등록 상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'registrationStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'registrationStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={registrationStatusData}
              />
            }
            value={filters?.gender || undefined}
          />

          <TableTextFilter
            displayValue={filters?.searchText || undefined}
            onFilterApply={(value) => {
              onChangeSelect({ name: 'searchText', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'searchText', value: null });
            }}
          />

          {hasFilters(filters) ? (
            <Button onClick={() => handleClearFilters()}>조건 초기화</Button>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};
export { JoinAttendeeListFilters };
