import React, { useCallback } from 'react';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { Stack } from '@mui/material';
import { FilterButton } from '@/components/core/FilterButton';
import { FACULTY_STATUS_SEARCH_OPTIONS } from '@/constants/filterSelectOptions';
import { FACULTY_STATUS } from '@/api/types/facultyTypes';
import TableOneSelectFilterPopover from '@/components/core/table/filter/TableOneSelectFilterPopover';
import TableTextFilterPopover from '@/components/core/table/filter/TableTextFilterPopover';

export interface FacultyFiltersType extends TableSearchParams {
  searchText?: string;
  status?: FACULTY_STATUS;
}

interface FacultyListFiltersProps {
  cSearchParams: FacultyFiltersType;
  setSearchParams: (parma: any) => any;
  deleteSearchParams: () => any;
}

const FacultyListFilters = ({
  cSearchParams,
  setSearchParams,
}: FacultyListFiltersProps) => {
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
          cSearchParams?.status &&
          FACULTY_STATUS_SEARCH_OPTIONS.filter(
            (item) => item.value === cSearchParams.status
          )[0].label
        }
        label="노출 여부"
        onFilterApply={(value) => {
          onChangeSelect({ name: 'status', value });
        }}
        onFilterDelete={() => {
          onChangeSelect({ name: 'status', value: null });
        }}
        popover={
          <TableOneSelectFilterPopover
            title="연자 상태 선택"
            data={FACULTY_STATUS_SEARCH_OPTIONS}
          />
        }
        value={cSearchParams?.status}
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
        popover={<TableTextFilterPopover title="이름,소속,직책 검색" />}
        value={cSearchParams?.searchText}
      />
    </Stack>
  );
};

export { FacultyListFilters };
