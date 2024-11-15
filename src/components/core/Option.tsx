import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';

interface OptionProps {
  children: React.ReactNode;
  disabled?: boolean;
  value: string | number | boolean;
}

const Option = ({
  children,
  value,
  ...props
}: OptionProps): React.JSX.Element => {
  let processedValue: string | number;

  if (typeof value === 'boolean') {
    processedValue = `${value}`; // boolean은 문자열로 변환
  } else {
    processedValue = value; // number나 string은 그대로 사용
  }
  // console.log('value', value);
  // console.log('processedValue', processedValue);
  return (
    <MenuItem {...props} value={processedValue} data-type={typeof value}>
      {children}
    </MenuItem>
  );
};

export { Option };
