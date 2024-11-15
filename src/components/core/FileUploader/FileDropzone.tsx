'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { DropzoneOptions, FileWithPath } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';

export type File = FileWithPath;

export interface FileDropzoneProps extends DropzoneOptions {
  files?: File[];
  onRemove?: (file: File) => void;
  onRemoveAll?: () => void;
  onUpload?: () => void;
  children: React.ReactElement;
}

export function FileDropzone({
  children,
  ...props
}: FileDropzoneProps): React.JSX.Element {
  const { getRootProps, getInputProps, isDragActive } = useDropzone(props);

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          borderRadius: '20px',
          ...(isDragActive && {
            bgcolor: 'var(--mui-palette-action-selected)',
            opacity: 0.5,
          }),
          '&:hover': {
            ...(!isDragActive && {
              bgcolor: 'var(--mui-palette-action-hover)',
              borderRadius: '20px',
            }),
          },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {children}
        </Stack>
      </Box>
    </Stack>
  );
}
