import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import {
  FilterPopover,
  useFilterContext,
} from '@/components/core/FilterButton';
import { Option } from '@/components/core/Option';

const AppFilterPopover = (): JSX.Element => {
  const {
    anchorEl,
    onApply,
    onClose,
    open,
    value: initialValue,
  } = useFilterContext();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);
  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open}>
      <FormControl>
        <Select
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
        >
          {/* TODO 옵션 constants */}
          <Option value="">전체</Option>
          <Option value="메디스태프">메디스태프</Option>
          <Option value="베트윈">베트윈</Option>
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        적용하기
      </Button>
    </FilterPopover>
  );
};

export { AppFilterPopover };
