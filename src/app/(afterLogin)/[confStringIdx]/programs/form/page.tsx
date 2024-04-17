'use client';

import { useQuery } from '@tanstack/react-query';

import FormLayout from '@/components/core/form/FormLayout';
import { getProgram } from '@/api/programApi';
import CategoryForm from '@/components/program/CategoryForm';
import SessionGroupListForm from '@/components/program/SessionGroupListForm';
import { PATH } from '@/paths';

type CreateProgramProps = {
  params: { confStringIdx: string };
};

export default function CreateProgram({ params }: CreateProgramProps) {
  const {
    isLoading,
    error,
    data: programData,
    refetch,
  } = useQuery({
    queryKey: ['program-only', params.confStringIdx],
    queryFn: () => getProgram(params.confStringIdx).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  if (error)
    return <div>현재 서버에 문제가 있어 데이터를 불러 올 수 없습니다.</div>;

  //  TODO : 이거 스켈레톤으로 변경하거나 로딩 페이지 디자인 따로 해야함
  if (isLoading) return <div>현재 필요한 데이터를 불러오고 있습니다.</div>;
  return (
    <FormLayout
      backLink={PATH.EACH.PROGRAM.LIST(params.confStringIdx)}
      backText={'프로그램 목록'}
      headText={'프로그램 생성'}
    >
      {/* 프로그램용 이미지 등록 폼 */}
      {/*<ImageListForm*/}
      {/*  fileData={programData?.files}*/}
      {/*  fileType="img[program]"*/}
      {/*  cn="program_image_upload_form"*/}
      {/*/>*/}

      {/* 카테고리 등록 폼 */}
      <CategoryForm refetch={refetch} programData={programData?.content} />

      {/* 세션 그룹 And 세션 관계자 연결 폼 */}
      <SessionGroupListForm
        refetch={refetch}
        programData={programData?.content}
      />
    </FormLayout>
  );
}
