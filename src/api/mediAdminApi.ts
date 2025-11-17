import { adminAxiosInstance } from '@/api/authApi';

export const getAdminOpenStatusActivePcoList = (): Promise<
  {
    thumbnailImageUrl?: string | null;
    conferenceIdx: number;
    conferenceStringIdx: string;
    conferenceName: string;
    conferenceStartT: string;
    conferenceEndT: string;
    conferencePreRegiStartT: string;
    conferencePreRegiEndT: string;
  }[]
> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/opened-conferences`)
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
