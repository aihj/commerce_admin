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
  PAYMENT_STATUS,
  REGISTRATION_STATUS,
} from '@/constants/filterSelectOptions';
import { hasFilters } from '@/lib/hasFilters';

const paymentSourceFD = [
  { value: 'card', label: '카드' },
  { value: 'eWallet', label: '간편결제' },
  { value: 'free', label: '무료 결제' },
  // { value: 'manual', label: '수동 계좌이체' },
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
    value: number;
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
              cSearchParams?.registrationStatus &&
              REGISTRATION_STATUS.filter(
                (item) => item.value === cSearchParams.registrationStatus
              )[0].label
            }
            label="등록상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'registrationStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'registrationStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="등록상태 선택"
                data={REGISTRATION_STATUS}
              />
            }
            value={cSearchParams?.registrationStatus}
          />

          <FilterButton
            displayValue={
              cSearchParams?.paymentStatus &&
              PAYMENT_STATUS.filter(
                (item) => item.value === cSearchParams.paymentStatus
              )[0].label
            }
            label="결제상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'paymentStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'paymentStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="결제상태 선택"
                data={PAYMENT_STATUS}
              />
            }
            value={cSearchParams?.paymentStatus}
          />

          <FilterButton
            displayValue={
              cSearchParams?.paymentSource &&
              paymentSourceFD.filter(
                (item) => item.value === cSearchParams.paymentSource
              )[0].label
            }
            label="결제수단"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'paymentSource', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'paymentSource', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="결제수단 선택"
                data={paymentSourceFD}
              />
            }
            value={cSearchParams?.paymentSource}
          />

          <FilterButton
            displayValue={
              cSearchParams?.regifeeIdx &&
              registrationType.filter(
                (item) => item.value === cSearchParams.regifeeIdx
              )[0].label
            }
            label="등록구분"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'regifeeIdx', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'regifeeIdx', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="등록구분 선택"
                data={registrationType}
              />
            }
            value={cSearchParams?.regifeeIdx}
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
