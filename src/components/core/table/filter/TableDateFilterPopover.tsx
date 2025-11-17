import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { logger } from '@/lib/logger/defaultLogger';
import {
  FilterPopover,
  useFilterContext,
} from '@/components/core/FilterButton';

import { useEffect, useState } from 'react';
import { dateFormat, dayjs } from '@/lib/dayjs';
import { Dayjs } from 'dayjs';

interface TableTextFilterPopoverProps {
  title?: string;
}

function TableDateFilterPopover({ title }: TableTextFilterPopoverProps) {
  const {
    anchorEl,
    onApply,
    onClose,
    open,
    value: initialValue,
  } = useFilterContext();
  const [value, setValue] = useState<Dayjs | null>(null);
  useEffect(() => {
    setValue(initialValue ? dayjs(initialValue) : null);
  }, [initialValue]);

  return (
    <FilterPopover
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      title={title}
    >
      <FormControl>
        <DatePicker
          format="YYYY-MM-DD"
          label=""
          onChange={(date) => {
            logger.debug('date', date);
            setValue(date ? dayjs(date) : null);
          }}
          value={value ? value : null}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value && dateFormat(value));
        }}
        variant="contained"
      >
        적용
      </Button>
    </FilterPopover>
  );
}
export { TableDateFilterPopover };
