'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { selectConferenceStringIdx } from '@/redux/slices/pcoSlice';
import { MediMain } from '@/components/main/MediMain';
import { PcoEachMain } from '@/components/main/PcoEachMain';

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const conferenceStringIdx = useSelector(selectConferenceStringIdx);
  /* ---------------------------------------------------------------------- */
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      {conferenceStringIdx === null ? <MediMain /> : <PcoEachMain />}
    </Box>
  );
}
