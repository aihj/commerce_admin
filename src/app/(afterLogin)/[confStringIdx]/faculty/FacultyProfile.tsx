import { Divider } from '@mui/material';
import Image from 'next/image';
import DefaultProfile from 'public/images/DefaultProfile.png';
import './faculty.css';

interface FacultyProfileProps {
  name: string;
  cv: string;
  profileUrl?: string;
  affiliation?: string;
}

const FacultyProfile = ({
  name,
  cv,
  profileUrl,
  affiliation,
}: FacultyProfileProps) => {
  return (
    <div className="flex flex-col px-16 items-center">
      {/* // w-432 md:w-300 lg:w-282 */}
      {/* // TODO 이미지 대체 */}
      <div className={`${affiliation ? 'w-110 h-110' : 'w-140 h-140'}`}>
        <Image
          src={profileUrl ?? DefaultProfile}
          width={affiliation ? 110 : 140}
          height={affiliation ? 110 : 140}
          style={{
            width: affiliation ? 110 : 140,
            height: affiliation ? 110 : 140,
            borderRadius: affiliation ? 110 : 140,
            objectFit: 'fill',
            border: '1px solid var(--color-gray-300)',
          }}
          alt={`faculty-${name}-profile`}
        />
      </div>
      {/* 연자 이름  */}
      <div className="pt-16 pb-6 text-20 text-gray-900 font-bold leading-normal">
        {name}
      </div>
      {affiliation ? (
        <span className="Label-14-Regular text-gray-600">{affiliation}</span>
      ) : null}
      {/* 연자 cv  */}

      {affiliation ? (
        <>
          <Divider
            sx={{ my: 4, borderColor: 'var(--color-gray-300)', width: '100%' }}
          />
          <div className="w-full text-left">
            <span className="Title-18-Bold">CV</span>
            <div
              className={`!pt-4 p-12 text-14 leading-20 facultyLi`}
              // style={{ width: 900 }}
              dangerouslySetInnerHTML={{
                __html: cv ?? '{전체 cv}',
              }}
            ></div>
          </div>
        </>
      ) : (
        <div
          className="min-h-44 text-16 text-gray-600 leading-22 facultyLi"
          dangerouslySetInnerHTML={{ __html: cv ?? '{간편 cv}' }}
        ></div>
      )}
    </div>
  );
};

export { FacultyProfile };
