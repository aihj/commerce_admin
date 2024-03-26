'use client';
import React from 'react';
import RouterLink from 'next/link';
import IconButton from '@mui/material/IconButton';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { DataTable } from '@/components/core/DataTable';
import type { ColumnDef } from '@/components/core/DataTable';
import { useTheme } from '@mui/material';

export interface Compensation {
  idx: number;
  condition: string;
  sex: string;
  birthDateAfter: string;
  birthDateBefore: string;
  userLevel: string;
  specialty: string;
  signInDateAfter: string;
  signInDateBefore: string;
  compenstionAmount: string;
  totalCapacity: string;
  compensatedNumber: string;
}

interface CompensationTableProps {
  rows?: Compensation[];
}

const ComponsationTable = ({ rows = [] }: CompensationTableProps) => {
  const theme = useTheme();
  const columns = [
    { field: 'condition', name: '보상 조건' },
    { field: 'sex', name: '성별', width: '20px' },
    { field: 'birthDateAfter', name: '생년월일(이후)' },
    { field: 'birthDateBefore', name: '생년월일(이전)' },
    { field: 'userLevel', name: '대상' },
    { field: 'specialty', name: '진료과' },
    { field: 'signInDateAfter', name: '가입날짜(이후)' },
    { field: 'signInDateBefore', name: '가입날짜(이전)' },
    { field: 'compenstionAmount', name: '보상 금액' },
    { field: 'totalCapacity', name: '총 정원' },
    { field: 'compensatedNumber', name: '보상 받은 인원' },
    {
      formatter: (): React.JSX.Element => (
        <div style={{ display: 'flex' }}>
          <IconButton
            component={RouterLink}
            // href={paths.dashboard.products.preview('1')}
            href={'/'}
          >
            <PencilSimpleIcon />
          </IconButton>
          <IconButton
            component={RouterLink}
            // href={paths.dashboard.products.preview('1')}
            href={'/'}
          >
            <TrashIcon fill={theme.palette.error.dark} />
          </IconButton>
        </div>
      ),
      name: 'Actions',
      hideName: true,
      width: '100px',
    },
  ] satisfies ColumnDef<Compensation>[];
  return (
    <div>
      <DataTable<Compensation> columns={columns} rows={rows} size="small" />
    </div>
  );
};

export default ComponsationTable;
