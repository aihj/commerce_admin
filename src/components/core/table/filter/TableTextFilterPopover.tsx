import {
  FilterPopover,
  useFilterContext,
} from '@/components/core/FilterButton';
import React from 'react';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

interface TableTextFilterPopoverProps {
  title?: string;
}

export default function TableTextFilterPopover({
  title,
}: TableTextFilterPopoverProps) {
  const {
    anchorEl,
    onApply,
    onClose,
    open,
    value: initialValue,
  } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      title={title}
    >
      <FormControl>
        <OutlinedInput
          placeholder="검색어 입력"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        적용
      </Button>
    </FilterPopover>
  );
}
