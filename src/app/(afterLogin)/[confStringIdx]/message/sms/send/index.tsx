'use client';

import { useState } from 'react';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { PageTitle } from '@/components/core/PageTitle';
import { useAppSelector } from '@/redux/hooks';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { Filter, Filters } from './Filters';
import { SMSForm } from './SMSForm';

const tabs = [
  {
    idx: 1,
    label: '그룹으로 보내기',
    value: 0,
  },
  {
    idx: 2,
    label: '회원에게 보내기',
    value: 1,
  },
  {
    idx: 3,
    label: '직접입력',
    value: 2,
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 3 }}>{children}</Box>}
    </div>
  );
}

const SMSSend = () => {
  const conferenceIdx = useAppSelector(selectConferenceIdx);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const [searchParam, setSearchParam] = useState<Filter>({
    conferenceIdx: conferenceIdx as number,
  });

  const [searchParamError, setSearchParamError] = useState<boolean>(false);

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <div className="mb-24">
        {/* TODO breadcrumbs */}
        <PageTitle title="문자 보내기" />
      </div>
      <Box>
        <Tabs
          onChange={handleTabChange}
          sx={{ px: 3 }}
          value={tabIndex ?? ''}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              sx={{ minHeight: 'auto' }}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Divider />
      </Box>
      <Box>
        <TabPanel value={tabIndex} index={0}>
          <Filters
            conferenceIdx={conferenceIdx as number}
            handleSearchParam={(param: Filter) => setSearchParam(param)}
            searchParamError={searchParamError}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          개인으로 보내기 Coming Soon
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          직접 입력 Coming Soon
        </TabPanel>
      </Box>
      <SMSForm
        searchParam={searchParam}
        conferenceIdx={conferenceIdx as number}
        setSearchParamError={(value: boolean) => setSearchParamError(value)}
      />
    </Box>
  );
};

export { SMSSend };
