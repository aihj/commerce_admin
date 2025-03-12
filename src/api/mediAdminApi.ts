import { adminAxiosInstance } from '@/api/authApi';

export const getAdminOpenStatusActivePcoList = (): Promise<
  {
    thumbnailImageUrl?: string | null;
    conference_idx: number;
    conference_string_idx: string;
    conference_name: string;
    conference_start_t: string;
    conference_end_t: string;
    committee_name: string;
  }[]
> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/medi/middle/admin-active-pco`)
    .then((response) => {
      /*logger.debug(
        '<getAdminOpenStatusActivePcoList> data : ',
        response.data.content
      );*/
      return response.data.content;
    });
};

export const getAdministrators = (): Promise<
  {
    name: string;
    wuserIdx: number;
  }[]
> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/managers`)
    .then((response) => {
      console.log('<getAdministrators> data : ', response.data.content);
      return response.data.content;
    });
};
