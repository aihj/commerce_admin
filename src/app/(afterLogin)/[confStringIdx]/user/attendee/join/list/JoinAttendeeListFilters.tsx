'use client';

import React, { useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FilterButton } from '@/components/core/FilterButton';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import { TableDateFilterPopover } from '@/components/core/table/filter/TableDateFilterPopover';
import TableTextFilter from '@/components/core/table/filter/TableTextFilter';
import { JoinAttendeeListSearchParamsType } from './page';

interface JoinAttendeeListFiltersProps {
  cSearchParams: JoinAttendeeListSearchParamsType | { [x: number]: any };
  setCSearchParamsFunc: (param: any) => any;
  deleteCSearchParams: () => any;
}

const JoinAttendeeListFilters = ({
  cSearchParams,
  setCSearchParamsFunc,
  deleteCSearchParams,
}: JoinAttendeeListFiltersProps) => {
  const onChangeSelect = useCallback((_selected: any) => {
    const data = { [_selected.name]: _selected.value };
    setCSearchParamsFunc(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 초기화
  const handleClearFilters = useCallback(() => {
    deleteCSearchParams();
  }, [deleteCSearchParams]);

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
  const wuserStatusData = useMemo(
    () => [
      { value: 'temp', label: '기회원' },
      { value: 'active', label: '회원' },
      { value: 'delete', label: '탈퇴' },
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
            displayValue={
              'birthDateStartT' in cSearchParams
                ? (cSearchParams?.birthDateStartT as string)
                : ''
            }
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
            value={
              'birthDateStartT' in cSearchParams
                ? (cSearchParams?.birthDateStartT as string)
                : ''
            }
          />
          <FilterButton
            displayValue={
              'birthDateEndT' in cSearchParams
                ? (cSearchParams?.birthDateEndT as string)
                : ''
            }
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
            value={
              'birthDateEndT' in cSearchParams
                ? (cSearchParams?.birthDateEndT as string)
                : ''
            }
          />

          <FilterButton
            displayValue={
              'gender' in cSearchParams
                ? (cSearchParams?.gender as string)
                : undefined
            }
            label="성별"
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
            value={
              'gender' in cSearchParams
                ? (cSearchParams?.gender as string)
                : undefined
            }
          />

          <FilterButton
            displayValue={
              'wuserStatus' in cSearchParams
                ? (cSearchParams?.wuserStatus as string)
                : undefined
            }
            label="회원 상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'wuserStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'wuserStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={wuserStatusData}
              />
            }
            value={
              'wuserStatus' in cSearchParams
                ? (cSearchParams?.wuserStatus as string)
                : undefined
            }
          />
          <FilterButton
            displayValue={
              'registrationStatus' in cSearchParams
                ? (cSearchParams?.registrationStatus as string)
                : undefined
            }
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
            value={
              'registrationStatus' in cSearchParams
                ? (cSearchParams?.registrationStatus as string)
                : undefined
            }
          />

          <TableTextFilter
            displayValue={
              'searchText' in cSearchParams
                ? (cSearchParams?.searchText as string)
                : undefined
            }
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
