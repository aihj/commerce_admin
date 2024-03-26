import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';

interface OptionProps {
  children: React.ReactNode;
  disabled?: boolean;
  value: string | number;
}

const Option = ({ children, ...props }: OptionProps): React.JSX.Element => {
  return <MenuItem {...props}>{children}</MenuItem>;
};

export { Option };
