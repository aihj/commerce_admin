import { DevTool } from '@hookform/devtools';
import { Divider, Typography } from '@mui/material';

type HtmlEditorListFormProps = {};

const HtmlEditorListForm = ({}: HtmlEditorListFormProps) => {
  // -------------------------------------------------------
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DevTool control={control} />
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={3}>
            <Stack>
              {/* 아래부터 CreateForm 내부 콘텐츠 */}
              <Typography color="primary" variant="h6">
                카테고리 입력
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}></CardActions>
      </Card>
    </form>
  );
};

export { HtmlEditorListForm };
