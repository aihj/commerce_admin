import { FilterButton } from '@/components/core/FilterButton';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import TableTextFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { ResetIcon } from '@/components/icons/ResetIcon';
import { hasFilters } from '@/lib/hasFilters';
import { Button, Stack } from '@mui/material';
import { useCallback } from 'react';
import { CONFERENCE_APPLY_STATUS } from '@/constants/filterSelectOptions';

export interface AppExposureConferenceFiltersType extends TableSearchParams {
  conferenceApplyStatus?: string;
  searchText?: string;
}
interface AppExposureConferenceFiltersProps {
  cSearchParams: AppExposureConferenceFiltersType;
  setSearchParams: (parma: any) => any;
  deleteSearchParams: () => any;
}

const AppExposureConferenceFilters = ({
  cSearchParams,
  setSearchParams,
  deleteSearchParams,
}: AppExposureConferenceFiltersProps) => {
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
        displayValue={
          cSearchParams?.conferenceApplyStatus &&
          CONFERENCE_APPLY_STATUS.filter(
            (item) => item.value === cSearchParams.conferenceApplyStatus
          )[0].label
        }
        label="등록 상태"
        onFilterApply={(value) => {
          onChangeSelect({ name: 'conferenceApplyStatus', value });
        }}
        onFilterDelete={() => {
          onChangeSelect({ name: 'conferenceApplyStatus', value: null });
        }}
        popover={
          <TableOneSelectFilterPopover
            title="등록 상태"
            data={CONFERENCE_APPLY_STATUS}
          />
        }
        value={cSearchParams?.conferenceApplyStatus}
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
        popover={<TableTextFilterPopover title="학회명, 주최, 주관 검색" />}
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

export { AppExposureConferenceFilters };
