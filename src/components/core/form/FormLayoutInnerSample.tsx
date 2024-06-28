import { DevTool } from '@hookform/devtools';
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
// import { Pco } from '@/redux/slices/pcoSlice';
// import { useAppSelector } from '@/redux/hooks';

type HtmlEditorListFormProps = NonNullable<unknown>;

// eslint-disable-next-line no-empty-pattern
const HtmlEditorListForm = ({}: HtmlEditorListFormProps) => {
  // const pco: Pco = useAppSelector((state) => state.pco);
  // region *********************** FORM 데이터 **************************
  /* const [isPending, setIsPending] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { conferenceIdx: pco.conferenceIdx },
  });*/
  // endregion *********************** FORM 데이터 ***********************
  return (
    <form
    // onSubmit={handleSubmit(onSubmit)}
    >
      <DevTool
      // control={control}
      />
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
