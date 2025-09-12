import React from 'react';
import { FacultyEdit } from '.';

const page = ({ params }: { params: { facultyIdx: string } }) => {
  return <FacultyEdit facultyIdx={Number(params.facultyIdx)} />;
};

export default page;
