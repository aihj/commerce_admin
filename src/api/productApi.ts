import { adminAxiosTest } from './authApi';

import { logger } from '@/lib/logger/defaultLogger';

export interface ProductListResponse<T> {
  totalCount: number;
  content: T[];
}

export type ApiResponseVo<T> = {
  status: number;
  code: string;
  message: string;
  content: T;
  desc?: string | null;
  error?: string | null;
  importance?: number;
  totalCount?: number | null;
};

export interface ProductDTO {
  productCode: string | null;
  productIdx: number;
  productCategory: string;
  productStatus: string;
  saleStatus: string;
  createT: string;
  updateT: string;

  supplierName: string | null;
  managerName: string | null;
  managerPhone: string | null;
  returnAddr: string | null;

  productName: string;
  costPrice: number;
  consumerPrice: number;
  productPrice: number;

  defaultShippingFee: number;
  jejuShippingFee: number | null;
  remoteShippingFee: number;
  refundShippingFee: number;
  launchStartT: string;
  launchEndT: string;
  maxQuantity: number;
  stockQuantity: number;

  thumbUrl: string | null;
  detailUrl: string | null;
}

export interface CreateProductRequest {
  name: string;
  category: string;
}
export interface UpdateProductStatusRequest {
  productIdx: number;
  saleStatus: string;
}

export type UpdateSupplierRequest = {
  supplierName: string;
  managerName?: string | null;
  managerPhone?: string | null;
  returnAddr?: string | null;
};

export const getAllProducts = (): Promise<ProductDTO[]> => {
  return adminAxiosTest
    .get('/api/public/productList')
    .then((res) => res.data.content);
};

export const getProductDetail = (productIdx: number): Promise<ProductDTO> => {
  return adminAxiosTest
    .get(`/api/public/productItem/${productIdx}`)
    .then((res) => res.data.content);
};

export const updateSale = async (
  productIdx: string,
  payload: UpdateSaleRequest
) => {
  const res = await adminAxiosTest.post<ApiResponseVo<string>>(
    `/api/public/${productIdx}/addSale`,
    payload,
    { headers: { accept: '*/*' } }
  );
  return res.data.content;
};

export const deleteProductFile = async (
  productIdx: number,
  kind: 'thumbnail' | 'detail',
  fileName: string
): Promise<string> => {
  const res = await adminAxiosTest.post<ApiResponseVo<string>>(
    `/api/public/deleteFile/${productIdx}`,
    { kind, fileName },
    {
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    }
  );
  return res.data.content;
};

export type CreateProductFileRequest = {
  kind: 'thumbnail' | 'detail';
  fileName: string;
  fileThumbnailPath: string;
};

const prune = (obj: Record<string, any>) => {
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === 'string' && v.trim() === '') return;
    if (Array.isArray(v) && v.length === 0) return;
    out[k] = v;
  });
  return out;
};

export const uploadProductFile = async (
  productIdx: number,
  file: File,
  kind: 'thumbnail' | 'detail'
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('kind', kind);

  await adminAxiosTest.post(`/api/public/file/${productIdx}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': undefined as any, // 브라우저가 boundary 포함해 자동 세팅
      Accept: '*/*',
    },
    transformRequest: [(data) => data],
  });
};

export const createProduct = (params: CreateProductRequest): Promise<void> => {
  const formData = new URLSearchParams();
  formData.append('name', params.name);
  formData.append('category', params.category);

  return adminAxiosTest
    .post('/api/public/productItem', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      logger.debug('<createProduct> response:', res.data);
      return res.data;
    })
    .catch((error) => {
      logger.error('<createProduct> error:', error);
      throw error;
    });
};

export const updateProductStatus = async (
  productIdx: string,
  saleStatus: string
) => {
  const res = await adminAxiosTest.post<ApiResponseVo<string>>(
    `/api/public/${productIdx}/saleStatus?saleStatus=${saleStatus}`,
    {},
    { headers: { accept: '*/*' } }
  );
  return res.data.content;
};

export const filterProducts = async (
  params: ProductFilterParams
): Promise<ProductListResponse<ProductDTO>> => {
  const payload = prune(params);
  console.log('filterProducts payload:', payload);
  payload.rowsPerPage = 1000;
  const res = await adminAxiosTest.post<ApiResponseVo<ProductDTO[]>>(
    '/api/public/productList/filter',
    payload,
    {
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    }
  );

  console.log('API 응답 전체:', res.data);
  console.log('API 응답 totalCount:', res.data.totalCount);
  console.log('API 응답 content 길이:', res.data.content?.length);

  const totalCount = res.data.totalCount ?? res.data.content?.length ?? 0;

  return {
    totalCount: totalCount,
    content: res.data.content || [],
  };
};

export const updateSupplier = async (
  productIdx: string,
  payload: UpdateSupplierRequest
): Promise<string> => {
  const body = prune(payload);

  const res = await adminAxiosTest.post<ApiResponseVo<string>>(
    `/api/public/${productIdx}/supplier`,
    body,
    {
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    }
  );

  return res.data.content;
};

export const updateStock = async (productIdx: string, maxQuantity: string) => {
  const res = await adminAxiosTest.post<ApiResponseVo<string>>(
    `/api/public/${productIdx}/stock?maxQuantity=${maxQuantity}`,
    {}, // body 없음
    { headers: { accept: '*/*' } }
  );
  return res.data.content;
};

type SortDir = 'ASC' | 'DESC';
export type UpdateSaleRequest = {
  productName: string;
  costPrice: number;
  consumerPrice: number;
  productPrice: number;
  defaultShippingFee: number;
  remoteShippingFee: number;
  jejuShippingFee: number;
  launchStartT: string;
  launchEndT: string;
};

export interface ProductFilterParams {
  productName?: string | null;
  productIdx?: number | null;
  productCategory?: string | null;
  productStatus?: string | null;
  saleStatus?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  userId?: number | null;
  orderId?: number | null;
  currentPage?: number | null;
  rowsPerPage?: number | null;
  sortType?: string; // 기본값 "o.order_idx"
  sortDir?: SortDir; // 기본값 "DESC"
}

export const getProductStatusHistory = async (
  productIdx: number
): Promise<string[]> => {
  const res = await adminAxiosTest.get<ApiResponseVo<string[]>>(
    `/api/public/${productIdx}/status-history`
  );
  return res.data.content;
};

export const getStockStatusHistory = async (
  productIdx: number
): Promise<string[]> => {
  const res = await adminAxiosTest.get<ApiResponseVo<string[]>>(
    `/api/public/${productIdx}/stock-history`
  );
  return res.data.content;
};
