import React from 'react';
import { SvgIcon } from '@mui/material';
import { IconProps } from './IconProps';

const BoldIcon = ({ className }: IconProps) => {
  return (
    <SvgIcon className={className}>
      <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.75 1.875C12.0282 1.875 13.875 3.72183 13.875 6C13.875 6.86832 13.6057 7.67327 13.1475 8.33789C14.4705 9.02481 15.375 10.4062 15.375 12C15.375 14.2782 13.5282 16.125 11.25 16.125H3.75C3.12868 16.125 2.625 15.6213 2.625 15V3L2.63086 2.88477C2.68857 2.31758 3.16758 1.875 3.75 1.875H9.75ZM4.875 13.875H11.25C12.2855 13.875 13.125 13.0355 13.125 12C13.125 10.9645 12.2855 10.125 11.25 10.125H4.875V13.875ZM4.875 7.875H9.75C10.7855 7.875 11.625 7.03553 11.625 6C11.625 4.96447 10.7855 4.125 9.75 4.125H4.875V7.875Z" />
      </svg>
    </SvgIcon>
  );
};

export { BoldIcon };
