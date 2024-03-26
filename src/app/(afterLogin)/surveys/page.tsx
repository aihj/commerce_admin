import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
// import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { dateFormat } from '@/lib/dayjs';

import { SurveysTable } from '@/components/surveys/SurveysTable';
import type { Survey } from '@/components/surveys/SurveysTable';
import { SurveyFilters } from '@/components/surveys/SurveyFilters';
import { TablePagination } from '@/components/core/TablePagination';

const surveys = [
  {
    idx: 112345,
    title: '1.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'ing',
  },
  {
    idx: 112345,
    title: '2.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
  {
    idx: 112345,
    title: '3.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
  {
    idx: 112345,
    title: '4.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
  {
    idx: 112345,
    title: '5.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
  {
    idx: 112345,
    title: '6.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
  {
    idx: 112345,
    title: '7.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
  {
    idx: 112345,
    title: '8.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
  {
    idx: 112345,
    title: '9.선생님께서는 어떤 과를 희망하시나요?',
    app: '메디스태프',
    supplier: '의사협의회',
    startDate: dateFormat('2023-03-03'),
    endDate: dateFormat('2023-03-05'),
    isShow: 'Y',
    userLevel: '의대생,의사,치과의사,치대생',
    meditInfo: '13.0/100.0',
    totalQuestions: 20,
    participants: 3500,
    status: 'draft',
  },
] satisfies Survey[];

interface SurveyPageProps {
  searchParams: {
    app?: string;
    search?: string;
    supplier?: string;
    startDate?: string;
    endDate?: string;
    isShow?: string;
    userLevel?: string;
    status?: string;
    sortDir?: 'asc' | 'desc';
  };
}

const SurveyPage = ({ searchParams }: SurveyPageProps) => {
  const {
    app,
    search,
    supplier,
    startDate,
    endDate,
    isShow,
    userLevel,
    status,
    sortDir,
  } = searchParams;
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">설문조사</Typography>
          </Box>
          <div>
            <Button
              // component={RouterLink}
              // href={paths.dashboard.products.create}
              startIcon={<PlusIcon />}
              variant="contained"
            >
              설문등록
            </Button>
          </div>
        </Stack>
        <Card>
          <SurveyFilters
            filters={{
              app,
              search,
              supplier,
              startDate,
              endDate,
              isShow,
              userLevel,
              status,
            }}
            sortDir={sortDir}
          />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <SurveysTable rows={surveys} />
          </Box>
          <Divider />
          {/* // TODO 현재 페이지네이션은 진짜 UI만 있음 */}
          <TablePagination count={surveys.length} page={0} />
        </Card>
      </Stack>
    </Box>
  );
};

export default SurveyPage;
