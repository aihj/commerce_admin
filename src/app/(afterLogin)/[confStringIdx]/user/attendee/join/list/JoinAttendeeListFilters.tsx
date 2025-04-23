'use client';

import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FilterButton } from '@/components/core/FilterButton';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import { JoinAttendeeListSearchParamsType } from './page';
import {
  BIRTH_YEAR_RANGE,
  GENDERS,
  WUSER_STATUS,
} from '@/constants/filterSelectOptions';
import TableTextFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';
import { ResetIcon } from '@/components/icons/ResetIcon';
import { hasFilters } from '@/lib/hasFilters';

interface JoinAttendeeListFiltersProps {
  cSearchParams: JoinAttendeeListSearchParamsType;
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
              <TableOneSelectFilterPopover
                title="생년 시작 년도 검색"
                data={BIRTH_YEAR_RANGE}
              />
            }
            value={cSearchParams?.birthDateStartT}
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
              <TableOneSelectFilterPopover
                title="생년 종료 년도 검색"
                data={BIRTH_YEAR_RANGE}
              />
            }
            value={cSearchParams?.birthDateEndT}
          />

          <FilterButton
            displayValue={
              cSearchParams?.gender &&
              GENDERS.filter((item) => item.value === cSearchParams.gender)[0]
                .label
            }
            label="성별"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'gender', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'gender', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover title="성별 선택" data={GENDERS} />
            }
            value={cSearchParams?.gender}
          />

          <FilterButton
            displayValue={
              cSearchParams?.wuserRoleStatus &&
              WUSER_STATUS.filter(
                (item) => item.value === cSearchParams.wuserRoleStatus
              )[0].label
            }
            label="회원상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'wuserRoleStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'wuserRoleStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="회원상태 선택"
                data={WUSER_STATUS}
              />
            }
            value={cSearchParams?.wuserRoleStatus}
          />

          <FilterButton
            displayValue={cSearchParams?.searchText}
            label="검색어"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'searchText', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'searchText', value: null });
            }}
            popover={<TableTextFilterPopover title="이름,전화번호,메모 검색" />}
            value={cSearchParams?.searchText}
          />

          {hasFilters(cSearchParams) ? (
            <Button
              sx={{ px: 2, py: 1 }}
              startIcon={<ResetIcon className="fill-white" />}
              onClick={() => handleClearFilters()}
              variant="contained"
              color="secondary"
            >
              초기화
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </div>
  );
};
export { JoinAttendeeListFilters };
