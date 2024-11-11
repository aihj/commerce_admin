'use client';

import { useState } from 'react';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { PageTitle } from '@/components/core/PageTitle';
import { useAppSelector } from '@/redux/hooks';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { Filter, Filters } from './Filters';
import { SMSForm } from './SMSForm';
import { SelectUsers } from './SelectUsers';
import { SEND_TYPE } from '@/constants/sendTypes';
import { AddUserDirectly } from './AddUserDirectly';
import { DirectUser, ExcelUploadedUser } from '@/types/user';
import { ExcelUpload } from './ExcelUpload';

const tabs = [
  {
    idx: 1,
    label: '회원에게 보내기',
    type: SEND_TYPE.USER,
    value: 0,
  },
  {
    idx: 2,
    label: '그룹으로 보내기',
    type: SEND_TYPE.FILTER,
    value: 1,
  },
  {
    idx: 3,
    label: '직접입력',
    type: SEND_TYPE.DIRECT,
    value: 2,
  },
  {
    idx: 4,
    label: '엑셀파일로 보내기',
    type: SEND_TYPE.EXCEL,
    value: 3,
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
  const [sendType, setSendType] = useState<SEND_TYPE>(tabs[0].type);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSendType(tabs[newValue].type);
  };

  const [searchFilterParam, setSearchFilterParam] = useState<Filter>({
    conferenceIdx: conferenceIdx as number,
  });

  // 회원 검색 개별 발송
  const [searchedUsers, setSearchedUsers] = useState<number[]>([]);

  // 직접 입력 발송
  const [addedUsers, setAddedUsers] = useState<DirectUser[]>([]);

  // 필터 발송
  const [searchParamError, setSearchParamError] = useState<boolean>(false);

  // 엑셀 업로드 발송
  const [excelUploadedUser, setExcelUploadedUser] = useState<
    ExcelUploadedUser[]
  >([]);

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
          <SelectUsers
            conferenceIdx={conferenceIdx as number}
            handleSearchedUsers={(param: number[]) => setSearchedUsers(param)}
            searchParamError={searchParamError}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Filters
            conferenceIdx={conferenceIdx as number}
            handleSearchParam={(param: Filter) => setSearchFilterParam(param)}
            searchParamError={searchParamError}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <AddUserDirectly
            addedUsers={addedUsers}
            handleAddedUser={(user: DirectUser[]) => {
              setAddedUsers(user);
            }}
            searchParamError={searchParamError}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <ExcelUpload
            handleExcelUploadedUser={(user: ExcelUploadedUser[]) => {
              setExcelUploadedUser(user);
            }}
            searchParamError={searchParamError}
          />
        </TabPanel>
      </Box>
      <SMSForm
        searchParam={searchFilterParam}
        searchedUsers={searchedUsers}
        addedUsers={addedUsers}
        excelUploadedUser={excelUploadedUser}
        sendType={sendType}
        conferenceIdx={conferenceIdx as number}
        setSearchParamError={(value: boolean) => setSearchParamError(value)}
      />
    </Box>
  );
};

export { SMSSend };
