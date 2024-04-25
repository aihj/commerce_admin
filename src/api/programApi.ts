import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';
import { EnterpriseListResVo } from '@/api/types/enterpriseListResVo';
import { adminAxiosInstance } from '@/api/authApi';
import { ResponseMessageVo } from '@/api/types/responseMessageVo';
import { TableSearchParams } from '@/api/types/tableSearchParams';

// region *********************** Program DT ***********************
/**
 * 학회 프로그램 정보 가져오기
 * @summary getProgramDT
 */
const getProgramDT = (
  params: TableSearchParams,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<EnterpriseListResVo> | void> => {
  const url = `/api/pco/${params.confStringIdx}/program-dt`;
  return adminAxiosInstance
    .post(url, params, options)
    .then((response) => {
      console.log('AxiosResponse response : ', response);
      return response.data;
    })
    .catch((error) => {
      console.log('AxiosResponse error: ', error);
      throw error;
    });
};

const getProgramDTQueryKey = (params: TableSearchParams) => {
  const url = `/api/pco/${params.confStringIdx}/program-dt`;
  return [url, ...(params ? [params] : [])] as const;
};

const getProgramDTQueryOptions = <
  TData = Awaited<ReturnType<typeof getProgramDT>>,
  TError = AxiosError<ResponseMessageVo>,
>(
  params: TableSearchParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getProgramDT>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  }
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getProgramDTQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getProgramDT>>> = ({
    signal,
  }) => getProgramDT(params, { signal, ...axiosOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getProgramDT>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

/**
 * @summary getProgramDT
 */
export const useProgramDt = <
  TData = Awaited<ReturnType<typeof getProgramDT>>,
  TError = AxiosError<ResponseMessageVo>,
>(
  params: TableSearchParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getProgramDT>>, TError, TData>
    >;
    axios?: AxiosRequestConfig;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getProgramDTQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };
  query.queryKey = queryOptions.queryKey;
  return query;
};
// endregion *********************** Enterprise Conference 목록 가져오기 ***********************

export async function getProgram(confStringIdx: string) {
  return adminAxiosInstance.get(`/api/pco/${confStringIdx}/programs`);
}

// 학회 프로그램 카테고리 입력 및 수정
export function updateProgramCategory(params: any) {
  return adminAxiosInstance.post(`/api/pco/program/category`, params);
}

// 학회 프로그램 세션 그룹 입력 및 숮어
export function updateProgramSessionGroup(params: any) {
  return adminAxiosInstance.post(
    `/api/pco/program/session-group`,
    params
    // {headers:adminAuthHeader()}
  );
}

export function getSessionGroupDetail(
  confStringIdx: string,
  sessionGroupIdx: number
) {
  return adminAxiosInstance.get(
    `/api/pco/${confStringIdx}/program/session-group/${sessionGroupIdx}`
    // { headers: adminAuthHeader() }
  );
}

// 세션 그룹 디테일 페이지 정보 입력 & 수정하기
export async function updateSessionGroupDetail(params: any) {
  // console.log(`params : ${params}`);
  return adminAxiosInstance.post(
    `/api/pco/program/session-group-detail`,
    params
    // { headers: adminAuthHeader() }
  );
}
