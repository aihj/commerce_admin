import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { Option } from '@/components/core/option';
import {
  FilterPopover,
  useFilterContext,
} from '@/components/core/FilterButton';
import { useEffect, useState } from 'react';

interface TableOneSelectFilterPopoverProps {
  title?: string;
  data: [{ label: string; value: string }];
}

export default function TableOneSelectFilterPopover({
  title,
  data,
}: TableOneSelectFilterPopoverProps) {
  // console.log('TableOneSelectFilterPopover data : ', data);
  // TODO : 이건 어떻게 사용하는거지?
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
    <FilterPopover
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      title={title}
    >
      <FormControl>
        <Select
          onChange={(event) => {
            console.log('Select event.target.value : ', event.target.value);
            setValue(event.target.value);
          }}
          value={value}
        >
          <Option value="">Select a category</Option>
          {data.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}
