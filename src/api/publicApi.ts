import axios from 'axios';
import { PcoBaseInfoVo } from '@/types/type';
import {
  GetPcoInfoForFirstRequest,
  UserDuplicatedInfoRequest,
} from './types/publicTypes';
import { ResponseMessageVo } from '@/types/type';
import { logger } from '@/lib/logger/defaultLogger';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// 학회 기본 데이터 가져오기
export const getPcoInfoForFirst = (
  data: GetPcoInfoForFirstRequest
): Promise<PcoBaseInfoVo> => {
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/public/pco/pco-info`,
      { url: siteUrl, confStringIdx: data.conferenceStringIdx },
      { headers: { conferenceIdx: data.conferenceIdx } }
    )
    .then((result) => result.data.content);
};

/**
 * 해당 attendee의 환불 받을 수 있는 금액 체크하기(결제 방식이 수동계좌이체인경우)
 * @param params
 */
export const checkRefundAmount = (
  conferenceIdx: number,
  attendeePaymentIdx: number
): Promise<number> => {
  // logger.debug('<checkRefundAmount> params ', params);
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/public/pco/attendee/check-refund-amount`,
      {
        conferenceIdx,
        attendeePaymentIdx,
      }
    )
    .then((response) => {
      // logger.debug('<getJoinAttendeeDt> response.data : ', response.data);
      return response.data.content;
    });
};

/**
 * 이메일 중복 체크
 * @param UserDuplicatedInfoRequest
 * @returns
 */
export const checkDuplicatedEmail = (
  params: UserDuplicatedInfoRequest
): Promise<ResponseMessageVo<null>> => {
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/public/pco/user/email-duplicate`,
      params,
      {
        headers: {
          conferenceIdx: params.conferenceIdx,
        },
      }
    )
    .then((response) => {
      logger.debug('<checkDuplicatedEmail> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 휴대폰 번호 중복 체크
 * @param UserDuplicatedInfoRequest
 * @returns
 */
export const checkDuplicatedPhone = (
  params: UserDuplicatedInfoRequest
): Promise<ResponseMessageVo<null>> => {
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/public/pco/user/phone-duplicate`,
      params
    )
    .then((response) => {
      logger.debug('<checkDuplicatedPhone> response.data : ', response.data);
      return response.data;
    });
};
