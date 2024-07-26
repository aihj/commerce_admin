'use client';

import React, { useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FilterButton } from '@/components/core/FilterButton';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import { TableDateFilterPopover } from '@/components/core/table/filter/TableDateFilterPopover';
import TableTextFilter from '@/components/core/table/filter/TableTextFilter';

const JoinAttendeeListFilters = <T extends object>(
  cSearchParams: T,
  setCSearchParams: () => Promise<any>
) => {
  const onChangeSelect = useCallback((_selected: any) => {
    setCSearchParams({ [_selected.name]: _selected.value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 초기화
  const handleClearFilters = useCallback(() => {
    // 모든 매개변수를 삭제
    const keysToDelete = Array.from(cSearchParams.keys());
    keysToDelete.forEach((key) => {
      setCSearchParams({ [key]: null });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cSearchParams]);

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
            displayValue={cSearchParams?.birthDateStartT}
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
            value={cSearchParams?.birthDateStartT}
          />
          <FilterButton
            displayValue={cSearchParams?.birthDateEndT}
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
            value={cSearchParams?.birthDateEndT}
          />

          <FilterButton
            displayValue={cSearchParams?.gender}
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
            value={cSearchParams?.gender || undefined}
          />

          <FilterButton
            displayValue={cSearchParams?.gender}
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
            value={cSearchParams?.gender || undefined}
          />

          <TableTextFilter
            displayValue={cSearchParams?.searchText || undefined}
            onFilterApply={(value) => {
              onChangeSelect({ name: 'searchText', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'searchText', value: null });
            }}
          />

          {hasFilters(cSearchParams) ? (
            <Button onClick={() => handleClearFilters()}>조건 초기화</Button>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};
export { JoinAttendeeListFilters };
