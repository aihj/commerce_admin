'use client';

import React, { useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FilterButton } from '@/components/core/FilterButton';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import { TableDateFilterPopover } from '@/components/core/table/filter/TableDateFilterPopover';
import TableTextFilter from '@/components/core/table/filter/TableTextFilter';
import { RegisterAttendeeListTypeManualSearchParamsType } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeManual';

interface RegisterAttendeeListFiltersProps {
  cSearchParams: RegisterAttendeeListTypeManualSearchParamsType;
  setCSearchParamsFunc: (parma: any) => any;
  deleteCSearchParams: () => any;
}

const RegisterAttendeeListTypeManualFilters = ({
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

  const genderFilterData = useMemo(
    () => [
      { value: 'F', label: '여성' },
      { value: 'M', label: '남성' },
    ],
    []
  );

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

  const registrationStatusFD = useMemo(
    () => [
      { value: 'preRegi', label: '사전 등록' },
      { value: 'onSiteRegi', label: '현장 등록' },
      { value: 'cancelled', label: '등록 취소' },
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
            value={cSearchParams?.gender || undefined}
          />

          <FilterButton
            displayValue={cSearchParams?.hasMemo}
            label="메모 여부"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'hasMemo', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'hasMemo', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={memoFD}
              />
            }
            value={cSearchParams?.hasMemo || undefined}
          />

          <FilterButton
            displayValue={cSearchParams?.wuserStatus}
            label="결제 상태"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'wuserStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'wuserStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={paymentStatusFD}
              />
            }
            value={cSearchParams?.wuserStatus || undefined}
          />

          <FilterButton
            displayValue={cSearchParams?.registrationStatus}
            label="등록 구분"
            onFilterApply={(value) => {
              onChangeSelect({ name: 'registrationStatus', value });
            }}
            onFilterDelete={() => {
              onChangeSelect({ name: 'registrationStatus', value: null });
            }}
            popover={
              <TableOneSelectFilterPopover
                title="Filter by category"
                data={registrationStatusFD}
              />
            }
            value={cSearchParams?.registrationStatus || undefined}
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
export { RegisterAttendeeListTypeManualFilters };
