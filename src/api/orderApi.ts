import { adminAxiosTest } from '@/api/authApi';
// import { ResponseMessageVo } from './types/responseMessageVo';
import { logger } from '@/lib/logger/defaultLogger';


export interface OrderListDTO {
  orderIdx: string;
  orderId: string;
  userName: string;
  createT: string;
  userContactNumber: string;
  productName: string;
  productIdx: string;
  orderStatus: string;
  quantity: number;
  orderAmount: number;
  taxInvoiceStatus: string;
  taxBusinessNo: string;
  taxEmail: string;
  taxMemo: string;
  taxRequestT: string;
  trackingNumber: string;  
  carrierName: string;
}

export interface OrderDTO {
  orderIdx: string;
  orderId: string;
  userName: string;
  userContactNumber: string;
  createT: string; // ISO 8601 문자열 (예: "2025-10-25T07:21:47.652Z")

  paymentStatus: string;
  deliveryStatus: string;
  orderStatus: string;
  // 상품 정보
  productCategory: string;
  productName: string;
  productPrice: number;
  quantity: number;
  itemTotalAmount: number;
  shippingFee: number;
  defaultShippingFee: number;
  remoteShippingFee: number;
  jejuShippingFee: number;
  orderAmount: number;
  taxRequestT: string;
  taxInvoiceStatus: string;
  taxEmail: string;
  taxBusinessNo: string;
  taxMemo: string;
  method: string;
  paymentTotalAmount: number;
  paymentApprovedAt: number;

  cancelAmount: number;
  cancelReason: string;
  canceledAt: string;
  postNo: number;
  address: string;
  addressDetail: string;
  recipientName: string;
  recipientPhone: string;
  recipientDoorlock: string;
  recipientMethod: string;
  carrierName: string;
  addressIdx: number;
  trackingNumber: string;
  memo: string;
}

type SortDir = 'ASC' | 'DESC';
export const getAllOrders = (): Promise<OrderListDTO[]> => {
  return adminAxiosTest
    .get('/api/public/orderList')
    .then((res) => res.data.content);
};

export const getOrderDetail = (orderIdx: number): Promise<OrderDTO> => {
  return adminAxiosTest
    .get(`/api/public/orderItem/${orderIdx}`)
    .then((res) => res.data.content);
};



export interface UpdateStatusRequest {
  orderIdx: number;
  status: string;
}

export interface UpdateTaxStatusRequest {
  orderIdx: number;
  status: string;
}

export interface UpdateCarrierInfoRequest {
  orderIdx: number;
  carrier: string;
  trackingNumber: string;
}

// 정렬 방향 한정
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


export type OrderStatusLabel =
  | '상품_준비중'
  | '주문_취소'
  | '배송중'
  | '배송_완료'
  | '구매_확정'
  | '환불_완료';


export async function updateStatus(orderIdx: number, status: string) {

  await adminAxiosTest.post(`/api/public/${orderIdx}/status`, null, {
    params: { status: status },          
   
  });
}

export async function updateStatusManual(orderIdx: number, status: string) {

  await adminAxiosTest.post(`/api/public/${orderIdx}/status/manual`, null, {
    params: { status: status },          
   
  });
}

export const updateTaxStatus = (
  params: UpdateTaxStatusRequest
): Promise<void> => {
  return adminAxiosTest
    .post(`/api/public/${params.orderIdx}/tax-invoice-status`, null, {
      params: { status: params.status },
      headers: { accept: '*/*' },
    })
    .then((res) => {
      logger.debug('<updateStatus> response:', res.data);
      return res.data;
    })
    .catch((error) => {
      logger.error('<updateStatus> error:', error);
      throw error;
    });
};

export const updateCarrierInfo = (
  params: UpdateCarrierInfoRequest
): Promise<void> => {
  return adminAxiosTest
    .post(`/api/public/${params.orderIdx}/tracking-param`, null, {
      params: {
        carrier: params.carrier,
        trackingNumber: params.trackingNumber,
      },
      headers: { accept: '*/*' },
    })
    .then((res) => {
      logger.debug('<updateStatus> response:', res.data);
      return res.data;
    })
    .catch((error) => {
      logger.error('<updateStatus> error:', error);
      throw error;
    });
};




export interface OrderFilterParams {
  productName?: string | null;
  orderStatuses?: string[] | null;
  taxInvoiceStatuses?: string[] | null;
  taxBusinessNo: string;
  taxEmail: string;
  taxMemo: string;
  taxRequestT: string;
  startDate?: string | null;
  endDate?: string | null;
  userName?: string | null;
  orderId?: number | null;
  page?: number; // 기본값 0
  size?: number; // 기본값 10
  sortType?: string; // 기본값 "o.order_idx"
  sortDir?: SortDir; // 기본값 "DESC"
}


// undefined/null/빈문자열/빈배열 제거
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

export const filterOrders = async (
  params: OrderFilterParams
): Promise<OrderListDTO[]> => {
  const payload = prune(params);

  const res = await adminAxiosTest.post(
    '/api/public/orderList/filter',
    payload,
    {
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    }
  );
  return res.data.content;
};


export const exportOrders = async (orderIds: number[]) => {
  const res = await adminAxiosTest.post(
    '/api/public/orderList/export',
    { orderIds },
    { responseType: 'arraybuffer' }  
  );

  const today = new Date();
  const formatted =
    today.getFullYear().toString().slice(2) + '.' +
    String(today.getMonth() + 1).padStart(2, '0') + '.' +
    String(today.getDate()).padStart(2, '0');


  const fileName = `메디스태프_상품주문서_배송요청서_${formatted}.xlsx`;

  const blob = new Blob(
    [res.data],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;   // ✅ 프론트에서 원하는 파일명 직접 적용
  a.click();
  URL.revokeObjectURL(url);
};

export const markDelivered = async (orderIds: number[]): Promise<string> => {
  const res = await adminAxiosTest.post<ApiResponseVo<string>>(
    '/api/public/mark-delivered',
    { orderIds }
  );
  return res.data.content; 
};


export const getOrderStatusHistory = async (
  orderIdx: number
): Promise<string[]> => {
  const res = await adminAxiosTest.get<ApiResponseVo<string[]>>(
    `/api/public/orderItem/${orderIdx}/status-history`
  );
  return res.data.content; 
};

export const updateMemo = async (
  orderIdx: number, memo: string) => {
  const res = await adminAxiosTest.post<ApiResponseVo<string>>(
    `/api/public/${orderIdx}/memo`,
    { memo },
    { headers: { 'Content-Type': 'application/json', accept: '*/*' } }
  );
  return res.data.content; 
};


export interface RefundOrderRequest {
  cancelReason: string;          // 취소 사유
  cancelAmount?: number;         // 부분환불 금액 (비우면 전체환불)
}

export const refundOrder = async (
  orderIdx: number,
  payload: RefundOrderRequest,
  token?: string
): Promise<ApiResponseVo<any>> => {
  // 토큰 접두사 보정
  const auth = token
    ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`)
    : undefined;

  const res = await adminAxiosTest.post<ApiResponseVo<any>>(
    `/api/admin/${orderIdx}/cancel`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'wserviceName': 'medistaff_admin',
        ...(auth ? { Authorization: auth } : {}),
      },
    }
  );
  return res.data;
};