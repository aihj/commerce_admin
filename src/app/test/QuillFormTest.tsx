'use client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { reactQuillSetting } from '@/lib/quill';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { HtmlSettingFormType } from '@/app/(afterLogin)/[confStringIdx]/etc/html/HtmlSettingFormType';
import { useState } from 'react';

type QuillFormTestTypes = NonNullable<unknown>;

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// eslint-disable-next-line no-empty-pattern
const QuillFormTest = ({}: QuillFormTestTypes) => {
  const {
    control,
    handleSubmit,
    formState: {
      // errors
    },
    // trigger,
  } = useForm<HtmlSettingFormType>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<HtmlSettingFormType> = (data) => {
    console.log(JSON.stringify(data.content));
  };
  const [data, setData] = useState();
  return (
    <article>
      {data}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          defaultValue={''}
          control={control}
          name={'content'}
          render={({ field }) => (
            <ReactQuill
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
                setData(data);
              }}
              style={{ height: '400px', backgroundColor: 'white' }}
              theme="snow"
              modules={reactQuillSetting}
            />
          )}
        />
        <p>d</p>
        <p>d</p>
        <p>d</p>
        <p>d</p>
        <p>d</p>
        <button type="submit">ㅋㅋㅋㅋㅋㅋㅋ</button>
      </form>
    </article>
  );
};
export { QuillFormTest };
