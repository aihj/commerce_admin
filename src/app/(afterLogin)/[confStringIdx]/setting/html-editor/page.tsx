'use client';
import FormLayout from '@/components/core/form/FormLayout';
import { SettingListForm } from '@/components/setting/SettingListForm';

type HtmlEditorProps = {};
const HtmlEditor = ({}: HtmlEditorProps) => {
  // -------------------------------------------------------
  return (
    <FormLayout backLink={null} headText={'HTML 에디터 편집'}>
      <SettingListForm />
    </FormLayout>
  );
};

export default HtmlEditor;
