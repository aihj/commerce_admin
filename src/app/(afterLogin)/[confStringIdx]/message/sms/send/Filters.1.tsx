import { Label } from '@/components/core/Label';
import { Box, Button, FormControl, Select, Stack } from '@mui/material';
import React from 'react';
import { ResetIcon } from '@/components/icons/ResetIcon';

const Filters = () => {
  const handleFilters = () => {};

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="그룹 선택*" />
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
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
                {data.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <Button
              sx={{ px: 2, py: 1 }}
              startIcon={<ResetIcon />}
              // onClick={() => handleClearFilters()}
              variant="contained"
              color="secondary"
            >
              초기화
            </Button>
            <Button
              sx={{ px: 2, py: 1 }}
              onClick={() => handleFilters()}
              variant="contained"
              color="primary"
            >
              전송 대상으로 선택
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="전송 대상*" />
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
            전송대상
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};
