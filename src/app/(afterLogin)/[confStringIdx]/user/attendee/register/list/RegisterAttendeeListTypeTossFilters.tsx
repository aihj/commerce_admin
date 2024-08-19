'use client';

import React, { useCallback, useMemo } from 'react';
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
} from '@/constants/selectOptions';

interface RegisterAttendeeListFiltersProps {
  cSearchParams: RegisterAttendeeListTypeTossSearchParamsType;
  setCSearchParamsFunc: (parma: any) => any;
  deleteCSearchParams: () => any;
}

const RegisterAttendeeListTypeTossFilters = ({
  cSearchParams,
  setCSearchParamsFunc,
  deleteCSearchParams,
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

  /*
  무료 등록
  */
  const paymentStatusFD = useMemo(
    () => [
      { value: 'freeRegi', label: '무료 등록' },
      { value: 'freeRegiCancelled', label: '무료 등록 취소' },
      { value: 'paymentCompleted', label: '결제 완료' },
      { value: 'refundCompleted', label: '환불 완료' },
      { value: 'pendingPayment', label: '결제 대기' },
    ],
    []
  );

  const paymentMethodFD = useMemo(
    () => [
      { value: 'card', label: '카드' },
      { value: 'eWallet', label: '간편결제' },
      { value: 'free', label: '무료 결제' },
      { value: 'manual', label: '수동 계좌이체' },
    ],
    []
  );

  const memoFD = useMemo(
    () => [
      { value: 'y', label: '메모 있음' },
      { value: 'n', label: '메모 없음' },
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
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={GENDERS}
              />
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
              <TableOneSelectFilterPopover title="메모 여부" data={memoFD} />
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
            label="등록구분"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'registrationStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'registrationStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="등록구분 선택"
                data={REGISTRATION_STATUS}
              />
            }
            value={cSearchParams?.registrationStatus}
          />

          <FilterButton
            displayValue={
              cSearchParams?.paymentStatus &&
              paymentStatusFD.filter(
                (item) => item.value === cSearchParams.paymentStatus
              )[0].label
            }
            label="결제 상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'paymentStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'paymentStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="결제 상태 선택"
                data={paymentStatusFD}
              />
            }
            value={cSearchParams?.paymentStatus}
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
            displayValue={cSearchParams?.searchText}
            label="검색어"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'searchText', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'searchText', value: null });
            }}
            popover={<TableTextFilterPopover title="이름,전화번호,메모 검색" />}
            value={cSearchParams?.paymentMethod}
          />

          {hasFilters(cSearchParams) ? (
            <Button
              sx={{ px: 2, py: 1 }}
              startIcon={<ResetIcon />}
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
