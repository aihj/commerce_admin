import { Controller } from 'react-hook-form';
import { reactQuillSetting } from '@/lib/quill';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { FormControl, InputLabel } from '@mui/material';

type HtmlEditorFormTypes = NonNullable<unknown>;

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// quill head가 두개 생기는 문제.. -> 로컬에서만 생기는 문제일듯 strict 모드라서
// https://stackoverflow.com/questions/72762180/react-quill-in-nextjs-has-a-duplicate-tab

const HtmlEditorForm = ({ register, control }: HtmlEditorFormTypes) => {
  return (
    <>
      <input type="hidden" {...register(`conferenceIdx`)} />
      <input
        type="hidden"
        {...register(`contentType`)}
        value={'venue-information'}
      />

      <FormControl>
        <InputLabel>content</InputLabel>
        <Controller
          defaultValue={null}
          control={control}
          name={'content'}
          render={({ field }) => (
            <ReactQuill
              value={field.value}
              onChange={(date) => field.onChange(date)}
              style={{ height: '400px', backgroundColor: 'white' }}
              theme="snow"
              modules={reactQuillSetting}
            />
          )}
        />
      </FormControl>
    </>
  );
};
export { HtmlEditorForm };
