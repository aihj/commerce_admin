import React from 'react';
import { StyledInputLabel } from '../../core/Form/Form.styles';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material';

interface MoreLinkProps {
  label: string;
  href: string;
  linkText: string;
}

const MoreLink = ({ label, href, linkText }: MoreLinkProps) => {
  console.log('href', href);
  const theme = useTheme();
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <StyledInputLabel>{label}</StyledInputLabel>
      <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
        {linkText}
      </span>
      <Button sx={{ textDecoration: 'underline' }}>바로가기</Button>
    </div>
  );
};

export { MoreLink };
