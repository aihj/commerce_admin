import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

export const metadata = {
  title: `학회 어드민`,
} satisfies Metadata;

type FormHeaderTypeProps = {
  children: React.ReactNode;
  backLink: string | null;
  backText?: string;
  headText: string;
};

export default function FormLayout({
  children,
  backLink,
  backText,
  headText,
}: FormHeaderTypeProps) {
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
        <Stack spacing={3}>
          <div>
            {backLink !== null && (
              <Link
                color="text.primary"
                component={RouterLink}
                href={backLink}
                sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
                variant="subtitle2"
              >
                <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
                {backText}
              </Link>
            )}
          </div>
          <div>
            <Typography variant="h4">{headText}</Typography>
          </div>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}
