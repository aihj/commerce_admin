import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { Option } from '@/components/core/Option';
import {
  FilterPopover,
  useFilterContext,
} from '@/components/core/FilterButton';
import { useEffect, useState } from 'react';

interface TableOneSelectFilterPopoverProps {
  title?: string;
  data: { label: string; value: string | number | boolean }[];
}

export default function TableOneSelectFilterPopover({
  title,
  data,
}: TableOneSelectFilterPopoverProps) {
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
          label="라벨"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
                width: 250,
              },
            },
          }}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
        >
          <Option value="">선택 안함</Option>
          {data.map((item, index) => (
            <Option key={`${item.value}-${index}`} value={item.value}>
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
        적용
      </Button>
    </FilterPopover>
  );
}
