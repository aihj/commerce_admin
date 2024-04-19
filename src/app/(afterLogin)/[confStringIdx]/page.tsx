'use client';

type PcoDetailTypes = {
  params: { confStringIdx: string };
};

// 해당 학회 관리자가 학회 정보를 수정할 수 있는 페이지
export default function PcoDetail({ params }: PcoDetailTypes) {
  return <article>{params.confStringIdx}</article>;
}
