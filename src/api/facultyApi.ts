import { adminAxiosInstance } from '@/api/authApi';
import { ResponseMessageVo } from './types/responseMessageVo';
import { logger } from '@/lib/logger/defaultLogger';
import {
  GetFacultiesResponse,
  GetFacultyRequest,
  GetFacultyResponse,
} from './types/facultyTypes';
import { FacultyFiltersType } from '@/app/(afterLogin)/[confStringIdx]/faculty/FacultyListFilters';

/**
 * 연자 목록 조회
 * @param params
 * @returns
 */
export const getFaculties = (
  params: FacultyFiltersType
): Promise<ResponseMessageVo<GetFacultiesResponse[]>> => {
  logger.debug('<getFaculties> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/faculty-dt`, params)
    .then((response) => {
      logger.debug('<getFaculties> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 연자 상세 조회
 * @param facultyIdx
 * @returns
 */
export const getFaculty = (
  facultyIdx: number
): Promise<ResponseMessageVo<GetFacultyResponse>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/faculty/${facultyIdx}`)
    .then((response) => {
      logger.debug('<getFaculty> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 연자 등록
 * @param params
 * @returns
 */
export const addFaculty = (
  params: GetFacultyRequest
): Promise<ResponseMessageVo<null>> => {
  logger.debug('<addFaculty> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/faculty`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      logger.debug('<addFaculty> response.data : ', response.data);
      return response.data;
    });
};
