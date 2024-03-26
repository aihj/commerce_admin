'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';

import type { ColumnDef } from '@/components/core/DataTable';
import { DataTable } from '@/components/core/DataTable';

export interface Survey {
  idx: number;
  title: string;
  app: string;
  supplier: string;
  startDate: string;
  endDate: string;
  isShow: string;
  userLevel: string;
  meditInfo: string;
  totalQuestions: number;
  participants: number;
  status: 'ing' | 'draft';
}

const columns = [
  { field: 'idx', name: 'ID', width: '80px' },
  {
    // 진행중 표시를 위한 예시
    formatter: (row): React.JSX.Element =>
      row.status === 'ing' ? (
        <Chip
          icon={
            <CheckCircleIcon
              color="var(--mui-palette-success-main)"
              weight="fill"
            />
          }
          label="진행중"
          size="small"
          variant="outlined"
        />
      ) : (
        <></>
      ),
    name: 'Status',
    hideName: true,
    width: '20px',
  },
  { field: 'title', name: '제목', width: '300px' },
  { field: 'app', name: '앱 구분', width: '100px' },
  { field: 'supplier', name: '주최/기관', width: '100px' },
  { field: 'startDate', name: '설문 시작일', width: '120px' },
  { field: 'endDate', name: '설문 종료일', width: '120px' },
  { field: 'isShow', name: '노출여부', width: '100px' },
  { field: 'userLevel', name: '노출대상', width: '200px' },
  { field: 'meditInfo', name: '지급 메딧/총 메딧', width: '150px' },
  { field: 'totalQuestions', name: '총 문항 수', width: '100px' },
  { field: 'participants', name: '참여인원', width: '100px' },
  {
    formatter: (): React.JSX.Element => (
      <IconButton
        component={RouterLink}
        // href={paths.dashboard.products.preview('1')}
        href={'/'}
      >
        <EyeIcon />
      </IconButton>
    ),
    name: 'Actions',
    hideName: true,
    width: '100px',
  },
] satisfies ColumnDef<Survey>[];

interface SurveysTableProps {
  rows?: Survey[];
}

const SurveysTable = ({ rows = [] }: SurveysTableProps): React.JSX.Element => {
  return (
    <React.Fragment>
      <DataTable<Survey> columns={columns} rows={rows} />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography
            color="text.secondary"
            sx={{ textAlign: 'center' }}
            variant="body2"
          >
            No surveys found
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
};
export { SurveysTable };
