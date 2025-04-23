'use client';

import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FilterButton } from '@/components/core/FilterButton';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import { RegisterAttendeeListTypeTossSearchParamsType } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeToss';
import { ResetIcon } from '@/components/icons/ResetIcon';
import TableTextFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';
import {
  BIRTH_YEAR_RANGE,
  GENDERS,
  REGISTRATION_STATUS,
} from '@/constants/filterSelectOptions';
import { hasFilters } from '@/lib/hasFilters';

const paymentMethodFD = [
  { value: '카드', label: '카드' },
  { value: '간편결제', label: '간편결제' },
  { value: '무료', label: '무료 결제' },
  { value: '수동계좌이체', label: '수동계좌이체' },
  { value: '토스계좌이체', label: '토스계좌이체' },
];

const memoFD = [
  { value: 'y', label: '메모 있음' },
  { value: 'n', label: '메모 없음' },
];

interface RegisterAttendeeListFiltersProps {
  cSearchParams: RegisterAttendeeListTypeTossSearchParamsType;
  setCSearchParamsFunc: (param: any) => any;
  deleteCSearchParams: () => any;
  registrationType: {
    value: string;
    label: string;
  }[];
}

const RegisterAttendeeListTypeTossFilters = ({
  cSearchParams,
  setCSearchParamsFunc,
  deleteCSearchParams,
  registrationType,
}: RegisterAttendeeListFiltersProps) => {
  // const [value, setValue] = useState<string>('');
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
              <TableOneSelectFilterPopover
                title="생년 시작 년도 검색"
                data={BIRTH_YEAR_RANGE}
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
              cSearchParams?.hasMemo &&
              memoFD.filter((item) => item.value === cSearchParams.hasMemo)[0]
                .label
            }
            label="메모 여부"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'hasMemo', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'hasMemo', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="메모 여부 선택"
                data={memoFD}
              />
            }
            value={cSearchParams?.hasMemo}
          />

          <FilterButton
            displayValue={
              cSearchParams?.regiStatus &&
              REGISTRATION_STATUS.filter(
                (item) => item.value === cSearchParams.regiStatus
              )[0].label
            }
            label="등록타입"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'regiStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'regiStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="등록타입 선택"
                data={REGISTRATION_STATUS}
              />
            }
            value={cSearchParams?.regiStatus}
          />

          <FilterButton
            displayValue={
              cSearchParams?.paymentMethod &&
              paymentMethodFD.filter(
                (item) => item.value === cSearchParams.paymentMethod
              )[0].label
            }
            label="결제수단"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'paymentMethod', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'paymentMethod', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="결제수단 선택"
                data={paymentMethodFD}
              />
            }
            value={cSearchParams?.paymentMethod}
          />

          <FilterButton
            displayValue={
              cSearchParams?.productName &&
              registrationType.filter(
                (item) => item.value === cSearchParams.productName
              )[0].label
            }
            label="등록구분"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'productName', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'productName', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="등록구분 선택"
                data={registrationType}
              />
            }
            value={cSearchParams?.productName}
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
export { RegisterAttendeeListTypeTossFilters };
