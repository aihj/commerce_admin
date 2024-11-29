import { FilterButton } from '@/components/core/FilterButton';
import { TableDateFilterPopover } from '@/components/core/table/filter/TableDateFilterPopover';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import TableTextFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { ResetIcon } from '@/components/icons/ResetIcon';
import {
  IS_FAIL,
  HAS_MEMO,
  SEND_STATUS_OPTIONS,
} from '@/constants/filterSelectOptions';
import { hasFilters } from '@/lib/hasFilters';
import { Button, Stack } from '@mui/material';
import { useCallback } from 'react';
import { dateFormat } from '@/lib/dayjs';

export interface SMSListFiltersType extends TableSearchParams {
  sendDateStartT?: string;
  taskStatus?: string;
  isFail?: boolean;
  senderWuserIdx?: number;
  searchText?: string;
  hasMemo?: boolean;
  contactNumberIdx?: number;
}
interface SMSListFiltersProps {
  cSearchParams: SMSListFiltersType;
  setSearchParams: (parma: any) => any;
  deleteSearchParams: () => any;
  administrators: { label: string; value: number }[];
  senders: { label: string; value: number }[];
}

const SMSListFilters = ({
  cSearchParams,
  setSearchParams,
  deleteSearchParams,
  administrators,
  senders,
}: SMSListFiltersProps) => {
  const onChangeSelect = useCallback((_selected: any) => {
    const data = { [_selected.name]: _selected.value };
    setSearchParams(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}
    >
      <FilterButton
        displayValue={cSearchParams?.sendDateStartT}
        label="발송 일시"
        onFilterApply={(value) => {
          onChangeSelect({
            name: 'sendDateStartT',
            value,
          });
        }}
        onFilterDelete={() => {
          onChangeSelect({ name: 'sendDateStartT', value: null });
        }}
        popover={<TableDateFilterPopover title="발송 일시 검색" />}
        value={
          cSearchParams?.sendDateStartT &&
          dateFormat(cSearchParams?.sendDateStartT)
        }
      />
      <FilterButton
        displayValue={
          cSearchParams?.hasMemo &&
          HAS_MEMO.filter((item) => item.value === cSearchParams.hasMemo)[0]
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
          <TableOneSelectFilterPopover title="메모 여부 선택" data={HAS_MEMO} />
        }
        value={cSearchParams?.hasMemo}
      />
      <FilterButton
        displayValue={
          cSearchParams?.taskStatus &&
          SEND_STATUS_OPTIONS.filter(
            (item) => item.value === cSearchParams.taskStatus
          )[0].label
        }
        label="발송 상태"
        onFilterApply={(value) => {
          onChangeSelect({ name: 'taskStatus', value });
        }}
        onFilterDelete={() => {
          onChangeSelect({ name: 'taskStatus', value: null });
        }}
        popover={
          <TableOneSelectFilterPopover
            title="발송 상태 선택"
            data={SEND_STATUS_OPTIONS}
          />
        }
        value={cSearchParams?.taskStatus}
      />
      <FilterButton
        displayValue={
          cSearchParams?.isFail &&
          IS_FAIL.filter((item) => item.value === cSearchParams.isFail)[0].label
        }
        label="실패 건 여부"
        onFilterApply={(value) => {
          onChangeSelect({ name: 'isFail', value });
        }}
        onFilterDelete={() => {
          onChangeSelect({ name: 'isFail', value: null });
        }}
        popover={
          <TableOneSelectFilterPopover
            title="실패 건 존재 여부 선택"
            data={IS_FAIL}
          />
        }
        value={cSearchParams?.isFail}
      />
      <FilterButton
        displayValue={
          cSearchParams?.senderWuserIdx &&
          administrators.filter(
            (item) => item.value === cSearchParams.senderWuserIdx
          )[0].label
        }
        label="담당자"
        onFilterApply={(value) => {
          onChangeSelect({ name: 'senderWuserIdx', value });
        }}
        onFilterDelete={() => {
          onChangeSelect({ name: 'senderWuserIdx', value: null });
        }}
        popover={
          <TableOneSelectFilterPopover
            title="담당자 선택"
            data={administrators}
          />
        }
        value={cSearchParams?.senderWuserIdx}
      />

      <FilterButton
        displayValue={
          cSearchParams?.senderWuserIdx &&
          senders.filter(
            (item) => item.value === cSearchParams.senderWuserIdx
          )[0].label
        }
        label="발신번호"
        onFilterApply={(value) => {
          onChangeSelect({ name: 'contactNumberIdx', value });
        }}
        onFilterDelete={() => {
          onChangeSelect({ name: 'contactNumberIdx', value: null });
        }}
        popover={
          <TableOneSelectFilterPopover title="발신번호 선택" data={senders} />
        }
        value={cSearchParams?.contactNumberIdx}
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
          onClick={() => deleteSearchParams()}
          variant="contained"
          color="secondary"
        >
          초기화
        </Button>
      ) : null}
    </Stack>
  );
};

export { SMSListFilters };
