'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

import { PATH } from '@/paths';
import { FilterButton } from '@/components/core/FilterButton';

import { AppFilterPopover } from './filterPopver/AppFilterPopover';

// TODO 카운트 값은 api
const tabs = [
  { label: '전체', value: '', count: 5 },
  { label: '진행중', value: 'status', count: 3 },
] as const;

interface Filters {
  app?: string;
  search?: string;
  supplier?: string;
  startDate?: string;
  endDate?: string;
  isShow?: string;
  userLevel?: string;
  status?: string;
}

type SortDir = 'asc' | 'desc';

interface SurveysFiltersProps {
  filters?: Filters;
  sortDir?: SortDir;
}

const SurveyFilters = ({
  filters = {},
  sortDir = 'desc',
}: SurveysFiltersProps): JSX.Element => {
  const {
    app,
    search,
    supplier,
    startDate,
    endDate,
    isShow,
    userLevel,
    status,
  } = filters;

  const router = useRouter();

  const [value, setValue] = useState<string>('');

  const updateSearchParams = useCallback(
    (newFilters: Filters, newSortDir: SortDir): void => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.app) {
        searchParams.set('app', newFilters.app);
      }

      if (newFilters.search) {
        searchParams.set('search', newFilters.search);
      }

      if (newFilters.supplier) {
        searchParams.set('supplier', newFilters.supplier);
      }

      if (newFilters.startDate) {
        searchParams.set('startDate', newFilters.startDate);
      }

      if (newFilters.endDate) {
        searchParams.set('endDate', newFilters.endDate);
      }

      if (newFilters.isShow) {
        searchParams.set('isShow', newFilters.isShow);
      }

      if (newFilters.userLevel) {
        searchParams.set('userLevel', newFilters.userLevel);
      }

      if (newFilters.userLevel) {
        searchParams.set('userLevel', newFilters.userLevel);
      }

      router.push(`${PATH.SURVEY.LIST}?${searchParams.toString()}`);
    },
    [router]
  );

  // TODO 조건별 popover 수정 / startdate, enddate 캘린더로 수정
  const handleClearFilters = useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleAppChange = useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, app: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleSupplierChange = useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, supplier: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleStartDateChange = useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, startDate: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleEndDateChange = useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, endDate: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleIsShowChange = useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, isShow: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleUserLevelChange = useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, userLevel: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );
  const handleSearchChange = React.useCallback(
    (value?: string) => {
      console.log(value);
      updateSearchParams({ ...filters, search: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleStatusChange = useCallback(
    (_: React.SyntheticEvent, value: string) => {
      updateSearchParams({ ...filters, status: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const hasFilters =
    app ||
    search ||
    supplier ||
    startDate ||
    endDate ||
    isShow ||
    userLevel ||
    status;

  return (
    <Box sx={{ p: 3 }}>
      <Tabs
        onChange={handleStatusChange}
        sx={{ px: 3 }}
        value={status ?? ''}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab
            icon={<Chip label={tab.count} size="small" variant="soft" />}
            iconPosition="end"
            key={tab.value}
            label={tab.label}
            sx={{ minHeight: 'auto' }}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider />
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap', pt: 2 }}
      >
        <FilterButton
          displayValue={app || undefined}
          label="앱 구분"
          onFilterApply={(value) => {
            handleAppChange(value as string);
          }}
          onFilterDelete={() => {
            handleAppChange();
          }}
          popover={<AppFilterPopover />}
          value={app || undefined}
        />
        <FilterButton
          displayValue={supplier || undefined}
          label="주최/기관"
          onFilterApply={(value) => {
            handleSupplierChange(value as string);
          }}
          onFilterDelete={() => {
            handleSupplierChange();
          }}
          popover={<AppFilterPopover />}
          value={supplier || undefined}
        />
        <FilterButton
          displayValue={startDate || undefined}
          label="설문 시작일"
          onFilterApply={(value) => {
            handleStartDateChange(value as string);
          }}
          onFilterDelete={() => {
            handleStartDateChange();
          }}
          popover={<AppFilterPopover />}
          value={startDate || undefined}
        />
        <FilterButton
          displayValue={endDate || undefined}
          label="설문 종료일"
          onFilterApply={(value) => {
            handleEndDateChange(value as string);
          }}
          onFilterDelete={() => {
            handleEndDateChange();
          }}
          popover={<AppFilterPopover />}
          value={endDate || undefined}
        />
        <FilterButton
          displayValue={isShow || undefined}
          label="노출 여부"
          onFilterApply={(value) => {
            handleIsShowChange(value as string);
          }}
          onFilterDelete={() => {
            handleIsShowChange();
          }}
          popover={<AppFilterPopover />}
          value={isShow || undefined}
        />
        <FilterButton
          displayValue={userLevel || undefined}
          label="노출 대상"
          onFilterApply={(value) => {
            handleUserLevelChange(value as string);
          }}
          onFilterDelete={() => {
            handleUserLevelChange();
          }}
          popover={<AppFilterPopover />}
          value={userLevel || undefined}
        />

        {/* 텍스트 검색 */}
        <FormControl>
          <OutlinedInput
            onChange={(event) => {
              setValue(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                handleSearchChange(value);
              }
            }}
            placeholder="제목,주최/기관을 검색하세요"
            value={value}
          />
        </FormControl>
        <Button
          onClick={() => {
            handleSearchChange(value);
          }}
          variant="contained"
        >
          검색
        </Button>
        {hasFilters ? (
          <Button onClick={handleClearFilters}>Clear filters</Button>
        ) : null}
      </Stack>
    </Box>
  );
};

export { SurveyFilters };
