export enum FACULTY_STATUS {
  active = 'active',
  inactive = 'inactive',
}

export const facultyStatusLabels = {
  [FACULTY_STATUS.active]: '노출',
  [FACULTY_STATUS.inactive]: '미노출',
};

export interface GetFacultiesResponse {
  facultyIdx: number;
  name: string;
  profileUrl?: string;
  affiliation?: string;
  position?: string;
  status: FACULTY_STATUS;
}

export interface FacultyFormData {
  facultyIdx?: number;
  name: string;
  affiliation?: string;
  position?: string;
  status: FACULTY_STATUS;
  profile: File;
  simpleCv?: string;
  cv?: string;
}

export interface GetFacultyRequest extends FacultyFormData {
  isDeleteProfile: boolean;
}

export interface GetFacultyResponse {
  facultyIdx: number;
  name: string;
  affiliation?: string;
  position?: string;
  profileUrl?: string;
  cv: string;
  simpleCv: string;
  status: FACULTY_STATUS;
}
