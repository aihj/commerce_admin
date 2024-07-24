'use client';

import FormLayout from '@/components/core/Form/FormLayout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { Button, Card, CardContent, Stack } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { HtmlEditorForm } from '@/app/(afterLogin)/[confStringIdx]/etc/html/HtmlEditorForm';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { updateHtmlSetting } from '@/api/api';
import { HtmlSettingFormType } from '@/app/(afterLogin)/[confStringIdx]/etc/html/HtmlSettingFormType';

type CreateProgramProps = {
  // params: { confStringIdx: string };
};

export default function VenueInformationPage(
  {
    // params
  }: CreateProgramProps
) {
  const conferenceIdx = useSelector(selectConferenceIdx);
  const {
    register,
    control,
    handleSubmit,
    formState: {
      // errors
    },
    // trigger,
  } = useForm<HtmlSettingFormType>({
    defaultValues: {
      conferenceIdx: conferenceIdx,
    },
  });

  const [isPending, setIsPending] = useState<boolean>(false);
  const onSubmit: SubmitHandler<HtmlSettingFormType> = (data) => {
    setIsPending(true);

    alert(data);
    // updateHtmlSetting(data)
    //   .then((result) => {
    //     Swal.fire({
    //       icon: 'success',
    //       text: result.message,
    //     });
    //   })
    //   .catch((result) => {
    //     console.log(result);
    //     Swal.fire({
    //       icon: 'error',
    //       text: result.response
    //         ? result.response.data.message
    //         : '현재 서버에 문제가 있습니다. 관리자에게 문의해주세요.',
    //     });
    //   })
    //   .finally(() => {
    //     setIsPending(false);
    //   });
  };

  return (
    <FormLayout backLink={null} headText={'오시는 길'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Stack>
              {/*<FormControl>*/}
              {/*  <InputLabel>title</InputLabel>*/}
              {/*  <OutlinedInput name="title" />*/}
              {/*</FormControl>*/}

              <HtmlEditorForm register={register} control={control} />
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained">Save</Button>
          </CardActions>
        </Card>
      </form>
    </FormLayout>
  );
}
