import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { logger } from '@/lib/logger/defaultLogger';
import {
  FilterPopover,
  useFilterContext,
} from '@/components/core/FilterButton';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface TableTextFilterPopoverProps {
  title?: string;
  format?: string;
}

function TableDateFilterPopover({
  title,
  format = 'YYYY-MM-DD',
}: TableTextFilterPopoverProps) {
  const {
    anchorEl,
    onApply,
    onClose,
    open,
    value: initialValue,
  } = useFilterContext();
  // logger.debug('initialValue : ', initialValue);
  const [value, setValue] = useState<string>(null);
  useEffect(() => {
    setValue((initialValue as string | undefined) ? dayjs(initialValue) : null);
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
            setValue(date ? dayjs(date).format(format) : null);
          }}
          value={value ? value : null}
        />
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
export { TableDateFilterPopover };
