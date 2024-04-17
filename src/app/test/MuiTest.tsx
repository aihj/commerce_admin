import { Button, Card, Divider, InputLabel, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react'; // Grid version 2
type MuiTestTypes = NonNullable<unknown>;

// eslint-disable-next-line no-empty-pattern
export default function MuiTest({}: MuiTestTypes) {
  return (
    <Card>
      <Grid container spacing={2}>
        <Grid xs={8}>
          <div>xs=8</div>
        </Grid>
        <Grid xs={4}>
          <div>xs=4</div>
        </Grid>
        <Grid xs={4}>
          <div>xs=4</div>
        </Grid>
        <Grid xs={8}>
          <div>xs=8</div>
        </Grid>
      </Grid>
      <Divider></Divider>
      <Grid container spacing={3}>
        <Grid md={4} xs={12}>
          <InputLabel required>카테고리 이름</InputLabel>
        </Grid>
        <Grid md={4} xs={12}>
          <div>아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ</div>
        </Grid>
        <Grid md={4} xs={12}>
          <Button className="h-10" variant="contained" type="button">
            Category 삭제
          </Button>
        </Grid>
      </Grid>
      <Divider></Divider>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} xs={12}>
        <InputLabel required>카테고리 이름</InputLabel>
        <div>아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ</div>
        <Button className="h-10" variant="contained" type="button">
          Category 삭제
        </Button>
      </Stack>
    </Card>
  );
}
