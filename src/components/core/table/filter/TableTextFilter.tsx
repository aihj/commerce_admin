import React from 'react';
import { Button, OutlinedInput } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { SearchIcon } from '@/components/icons/SearchIcon';

type TableTextFilterTypes = {
  displayValue?: string | undefined;
  onFilterApply?: (value: unknown) => void;
  onFilterDelete?: () => void;
  value?: unknown;
};

// eslint-disable-next-line no-empty-pattern
const TableTextFilter = ({
  displayValue,
  onFilterApply,
}: TableTextFilterTypes) => {
  const [value, setValue] = React.useState<string>('');
  React.useEffect(() => {
    setValue((displayValue as string | undefined) ?? '');
  }, [displayValue]);

  return (
    <>
      <Grid container alignItems="center">
        <OutlinedInput
          placeholder={'검색어를 입력해주세요.'}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onFilterApply?.(value);
            }
          }}
          value={value}
        />
        <Button
          sx={{ px: 2, py: 1 }}
          startIcon={<SearchIcon />}
          onClick={() => {
            onFilterApply?.(value);
          }}
          variant="contained"
        >
          검색
        </Button>
      </Grid>
    </>
  );
};
export default TableTextFilter;
