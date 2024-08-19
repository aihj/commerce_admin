import { FormControl, InputLabel, Select } from '@mui/material';
import { Option } from '@/components/core/Option';

interface FilterSelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  handelChange: (value: string) => void;
}

const FilterSelect = ({ label, options, handelChange }: FilterSelectProps) => {
  return (
    <FormControl sx={{ p: 0 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        placeholder={label}
        sx={{ height: '44px' }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
              minWidth: 80,
            },
          },
        }}
        onChange={(event) => {
          handelChange(event.target.value);
        }}
        defaultValue={label}
      >
        <Option value="">선택</Option>
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};

export { FilterSelect };
