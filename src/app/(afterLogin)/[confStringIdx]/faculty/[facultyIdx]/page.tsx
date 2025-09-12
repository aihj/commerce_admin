import React from 'react';
import { FacultyDetail } from '.';

const page = ({ params }: { params: { facultyIdx: string } }) => {
  return <FacultyDetail facultyIdx={params.facultyIdx} />;
};

export default page;
