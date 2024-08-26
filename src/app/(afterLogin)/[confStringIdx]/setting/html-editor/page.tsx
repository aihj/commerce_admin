'use client';
import FormLayout from '@/components/core/Form/FormLayout';
import { SettingListForm } from '@/components/setting/SettingListForm';

const HtmlEditor = () => {
  // -------------------------------------------------------
  return (
    <FormLayout backLink={null} headText={'HTML 에디터 편집'}>
      <SettingListForm />
    </FormLayout>
  );
};

export default HtmlEditor;
