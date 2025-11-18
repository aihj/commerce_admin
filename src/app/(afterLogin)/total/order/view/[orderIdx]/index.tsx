'use client';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Table from '@mui/material/Table';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import { PageTitle } from '@/components/core/PageTitle';
import { dayjs } from '@/lib/dayjs';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { getSession, signOut } from 'next-auth/react';
import { PATH } from '@/paths';

import {
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Stack,
  Popover,
  Paper,
} from '@mui/material';
import { useState, useEffect } from 'react';

import {
  getOrderDetail,
  getOrderStatusHistory,
  markDelivered,
  updateCarrierInfo,
  updateMemo,
  updateStatus,
  updateStatusManual,
  updateTaxStatus,
  refundOrder,
} from '@/api/orderApi';
import { PRODUCT_CATEGORY } from '@/api/types/productTypes';
import { recipientMethod } from '@/api/types/orderTypes';

const AppRegisterView = () => {
  const { orderIdx } = useParams<{ orderIdx: string }>();
  const parsedIdx = orderIdx ? parseInt(orderIdx, 10) : undefined;
  const { data } = useQuery({
    queryKey: ['orderDetail', parsedIdx],
    queryFn: () => getOrderDetail(parsedIdx!),
    enabled: !!parsedIdx, // parsedIdx가 있을 때만 실행
  });

  const [delivery, setDelivery] = useState<string>(data?.carrierName ?? '');
  const [tax, setTax] = useState<string>('none');
  const [isEditing, setIsEditing] = useState(false);
  const [tempStatus, setTempStatus] = useState<string>('');
  const [status, setStatus] = useState<string>(data?.orderStatus ?? '');
  const [openTrackingModal, setOpenTrackingModal] = useState(false);
  const [openDeliModal, setOpenDeliModal] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [historyAnchorEl, setHistoryAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [historyData, setHistoryData] = useState<string[]>([]);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(data?.memo ?? '');
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [refundAmount, setRefundAmount] = useState<number>(
    Number(data?.orderAmount) ?? 0
  );

  console.log('data', data);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.taxInvoiceStatus) {
      setTax(data.taxInvoiceStatus);
    }
    if (data?.carrierName) {
      setDelivery(data.carrierName);
    }
    if (data?.orderStatus) {
      setStatus(data.orderStatus);
      setTempStatus(data.orderStatus);
    }
    if (refundModalOpen && data?.orderAmount) {
      const baseAmount = Number(data.orderAmount) || 0;

      if (refundReason === '단순변심') {
        const calculatedAmount = baseAmount - (data?.shippingFee ?? 0) * 2;
        setRefundAmount(calculatedAmount > 0 ? calculatedAmount : 0);
      } else if (refundReason && refundReason !== 'direct') {
        // 단순변심이 아닌 다른 사유일 경우 orderAmount 그대로
        setRefundAmount(baseAmount);
      }
    }
  }, [refundModalOpen, refundReason, data?.orderAmount, data?.shippingFee]);

  console.log('refundReason', refundReason);

  const handleUpdateStatus = async (newStatus: string) => {
    console.log('newStatus', newStatus);
    try {
      await updateStatusManual(parsedIdx!, newStatus);

      alert(`주문 상태가 ${newStatus}으로 변경되었습니다`);
    } catch (error) {
      console.error('상태 변경 오류:', error);
      alert(`상태 변경 중 오류가 발생했습니다.`);
    }
  };

  const handleUpdateTaxStatus = async (newTaxStatus: string) => {
    try {
      await updateTaxStatus({
        orderIdx: parsedIdx!,
        status: newTaxStatus,
      });

      alert(`세금 계산서 처리 상태가 ${newTaxStatus}으로 변경되었습니다`);
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert(`${newTaxStatus}로 변경 중 오류가 발생했습니다.`);
    }
  };

  const handleHistoryClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setHistoryAnchorEl(event.currentTarget as HTMLButtonElement);

    try {
      const history = await getOrderStatusHistory(parsedIdx!);
      setHistoryData(history ?? []);
    } catch (e) {
      console.error('이력 조회 오류:', e);
      setHistoryData([]);
    }
  };

  const makeProductId = (
    productCategory: string | null | undefined,
    productIdx: number | undefined
  ): string => {
    if (!productCategory || !productIdx) return '-';

    const paddedIdx = String(productIdx).padStart(4, '0');

    return `${productCategory}${paddedIdx}`;
  };

  const handleMarkDelivered = async () => {
    if (!parsedIdx) return;

    try {
      setStatus('배송_완료');
      setTempStatus('배송_완료');
      await markDelivered([parsedIdx]);
      // // 리스트/상세 쿼리 모두 무효화 → 재조회
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({
        queryKey: ['orderDetail', parsedIdx],
      });
      await queryClient.invalidateQueries({
        queryKey: ['orderStatusHistory', parsedIdx],
      });
    } catch (error) {
      console.error('배송 완료 처리 중 오류:', error);
      alert('배송 완료 처리 중 오류가 발생했습니다.');
    }
  };

  const menuOptions = [
    {
      label: '주문_완료',
      value: '주문_완료',
      excluded: [
        '상품_준비중',
        '배송중',
        '배송_완료',
        '환불_완료',
        '구매_확정',
        '주문_취소',
      ],
    },
    {
      label: '상품_준비중',
      value: '상품_준비중',
      excluded: ['주문_완료', '환불_완료', '구매_확정', '주문_취소'],
    },
    {
      label: '주문_취소',
      value: '주문_취소',
      excluded: [
        '주문_완료',
        '상품_준비중',
        '배송중',
        '환불_완료',
        '구매_확정',
        '배송_완료',
      ],
    },
    {
      label: '배송중',
      value: '배송중',
      excluded: ['환불_완료', '구매_확정', '주문_취소'],
    },
    {
      label: '배송_완료',
      value: '배송_완료',
      excluded: ['환불_완료', '구매_확정', '주문_취소'],
    },
    {
      label: '환불_완료',
      value: '환불_완료',
      excluded: [
        '주문_완료',
        '상품_준비중',
        '배송중',
        '주문_취소',
        '배송_완료',
        '구매_확정',
      ],
    },
    {
      label: '구매_확정',
      value: '구매_확정',
      excluded: ['환불_완료', '주문_취소'],
    },
  ];

  async function handleRefund() {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (
      !token ||
      !session ||
      (session.expires && new Date(session.expires) < new Date())
    ) {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      await signOut({ callbackUrl: PATH.AUTH.NEXT_AUTH.LOGIN, redirect: true });
      return;
    }

    try {
      const orderAmount = Number(data?.orderAmount) || 0;
      const refundAmountNum = Number(refundAmount) || 0;

      if (refundAmountNum > orderAmount) {
        alert('환불 금액이 결제 금액보다 큽니다');
        return;
      }

      await refundOrder(
        parsedIdx!,
        {
          cancelReason: refundReason,
          cancelAmount: refundAmountNum,
        },
        token
      );

      setStatus('환불_완료');

      await queryClient.invalidateQueries({
        queryKey: ['orderDetail', parsedIdx],
      });
      await queryClient.invalidateQueries({ queryKey: ['orders'] });

      alert('환불 처리가 완료되었습니다.');
      setRefundModalOpen(false);
    } catch (error) {
      console.error('환불 처리 실패:', error);

      alert('환불 처리 중 오류가 발생했습니다.');
    }
  }

  const getShippingFeeText = () => {
    const shippingFee = data?.shippingFee ?? 0;
    const defaultFee = data?.defaultShippingFee ?? 0;
    const remoteFee = data?.remoteShippingFee ?? 0;
    const jejuFee = data?.jejuShippingFee ?? 0;

    if (shippingFee === defaultFee) {
      return `배송비: ${shippingFee} (기본 배송비: ${defaultFee})`;
    }

    if (shippingFee === defaultFee + remoteFee) {
      return `배송비: ${shippingFee} (기본 배송비 ${defaultFee}, 도서산간: ${remoteFee} 추가)`;
    }

    if (shippingFee === defaultFee + jejuFee) {
      return `배송비: ${shippingFee} (기본 배송비 ${defaultFee}, 제주지역: ${jejuFee} 추가)`;
    }

    // 기본값 (혹시 모를 경우)
    return `${shippingFee}`;
  };

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <div className="mb-24">
        <PageTitle title="주문 상세" />
      </div>

      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <h4 style={{ fontWeight: 'bold' }}>주문 정보</h4>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell>주문일시</TableCell>
                <TableCell>
                  {dayjs(data?.createT).format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>주문번호</TableCell>
                <TableCell>{data?.orderId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>주문자</TableCell>
                <TableCell>{data?.userName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>주문자 휴대폰번호</TableCell>
                <TableCell>{data?.userContactNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>주문 상태</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Select
                      value={tempStatus || data?.orderStatus || ''}
                      onChange={(e) => setTempStatus(e.target.value)} // tempStatus만 변경
                      size="small"
                      sx={{ minWidth: 80, maxHeight: 40 }}
                      disabled={!isEditing}
                    >
                      {menuOptions
                        .filter(
                          (opt) =>
                            !opt.excluded.includes(
                              status || data?.orderStatus || ''
                            )
                        )
                        .map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                    </Select>
                    <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          if (!isEditing) {
                            setIsEditing(true);
                            alert(
                              '주의! 주문상태 수기변경은 신중히 진행하는 것을 권장드립니다.'
                            );
                          } else {
                            handleUpdateStatus(tempStatus);
                            setStatus(tempStatus);
                          }
                        }}
                      >
                        {isEditing ? '저장' : '수기 변경'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleHistoryClick}
                      >
                        이력조회
                      </Button>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h4 style={{ fontWeight: 'bold', marginTop: '24px' }}>상품 정보</h4>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell>상품 카테고리</TableCell>
                <TableCell>
                  {PRODUCT_CATEGORY[
                    data?.productCategory as keyof typeof PRODUCT_CATEGORY
                  ] || ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>상품ID</TableCell>
                <TableCell>
                  {makeProductId(data?.productCategory, data?.productIdx)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>상품명</TableCell>
                <TableCell>{data?.productName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>상품 판매가</TableCell>
                <TableCell>{data?.productPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>주문 수량</TableCell>
                <TableCell>{data?.quantity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>합계 금액</TableCell>
                <TableCell>{data?.itemTotalAmount || 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송비</TableCell>
                <TableCell>{getShippingFeeText()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>총 금액</TableCell>
                <TableCell>{data?.orderAmount || 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h4 style={{ fontWeight: 'bold', marginTop: '24px' }}>
            세금 계산서 요청정보
          </h4>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell>요청 일시</TableCell>
                <TableCell>
                  {data?.taxRequestT
                    ? dayjs(data?.taxRequestT).format('YYYY-MM-DD HH:mm:ss')
                    : '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>처리 상태</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Select
                      value={tax || 'none'}
                      onChange={(e) => setTax(e.target.value)}
                      size="small"
                      sx={{ minWidth: 60, maxHeight: 40 }}
                      disabled={!isEditing}
                    >
                      <MenuItem value="none">요청없음</MenuItem>
                      <MenuItem value="pending">대기</MenuItem>
                      <MenuItem value="completed">완료</MenuItem>
                    </Select>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        if (!isEditing) {
                          setIsEditing(true);
                          if (status !== '구매_확정') {
                            alert(
                              '구매 확정 상태에서만 세금 계산서 처리 상태를 변경할 수 있습니다.' +
                                '\n'
                            );
                          }
                        } else {
                          handleUpdateTaxStatus(tax);
                          setTax(tax);
                        }
                      }}
                    >
                      {isEditing ? '저장' : '변경'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>사업자 등록번호</TableCell>
                <TableCell>{data?.taxBusinessNo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>이메일 주소</TableCell>
                <TableCell>{data?.taxEmail}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>요청 사항</TableCell>
                <TableCell>{data?.taxMemo}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ flex: 1 }}>
          <h4 style={{ fontWeight: 'bold' }}>결제 정보</h4>
          <Table sx={{ width: '40rem', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>결제 수단</TableCell>
                <TableCell>{data?.method}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>결재 금액</TableCell>
                <TableCell>{data?.orderAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>결제 일시</TableCell>
                <TableCell>
                  {dayjs(data?.createT).format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
              </TableRow>

              {status === '환불_완료' &&
                (() => {
                  return (
                    <>
                      <TableRow>
                        <TableCell>환불 사유</TableCell>
                        <TableCell>{data?.cancelReason || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>환불 제외 금액</TableCell>
                        <TableCell>
                          {data?.cancelAmount
                            ? data?.orderAmount - data?.cancelAmount
                            : ''}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>환불 금액</TableCell>
                        <TableCell>
                          {data?.cancelAmount ? data?.cancelAmount : ''}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>환불 일시</TableCell>
                        <TableCell>
                          {dayjs(data?.canceledAt).format(
                            'YYYY-MM-DD HH:mm:ss'
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })()}
            </TableBody>
          </Table>

          <h4 style={{ fontWeight: 'bold', marginTop: '24px' }}>배송 정보</h4>
          <Table sx={{ width: '40rem', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>배송지 주소</TableCell>
                <TableCell>{data?.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송지 상세주소</TableCell>
                <TableCell>{data?.addressDetail}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>받는 사람</TableCell>
                <TableCell>{data?.recipientName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>받는 사람 휴대폰번호</TableCell>
                <TableCell>{data?.recipientPhone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>현관 비밀번호</TableCell>
                <TableCell>{data?.recipientDoorlock}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송 요청사항</TableCell>
                <TableCell>
                  {recipientMethod[
                    data?.recipientMethod as keyof typeof recipientMethod
                  ] || ''}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ width: '120px' }}>택배사</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Select
                      value={data?.carrierName || 'none'}
                      onChange={(e) => setDelivery(e.target.value)}
                      size="small"
                      sx={{ minWidth: 60, maxHeight: 40 }}
                      disabled={!isEditing}
                    >
                      <MenuItem value="none">선택하세요</MenuItem>
                      <MenuItem value="CJGLS">CJ대한통운</MenuItem>
                      <MenuItem value="HYUNDAI">롯데택배</MenuItem>
                      <MenuItem value="HANJIN">한진택배</MenuItem>
                      <MenuItem value="EPOST">우체국택배</MenuItem>
                      <MenuItem value="KGB">로젠택배</MenuItem>
                      <MenuItem value="KDEXP">경동택배</MenuItem>
                    </Select>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={
                        status === '환불_완료' || status === '주문_취소'
                      }
                      onClick={() => {
                        setOpenTrackingModal(true);
                        // 모달 열 때 현재 값으로 초기화
                        setSelectedCourier(delivery || '');
                        setTrackingNumber(data?.trackingNumber || '');
                      }}
                    >
                      등록/변경
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>송장번호</TableCell>
                <TableCell>{data?.trackingNumber}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
            <h4 style={{ fontWeight: 'bold', margin: 0 }}>메모</h4>

            <Button
              variant="outlined"
              size="small"
              onClick={async () => {
                if (!isEditingMemo) {
                  setIsEditingMemo(true);
                  return;
                }

                try {
                  await updateMemo(parsedIdx!, memoText.trim());
                  alert('메모가 저장되었습니다.');
                  setIsEditingMemo(false);
                  await queryClient.invalidateQueries({
                    queryKey: ['orderDetail', parsedIdx],
                  });
                } catch (error) {
                  console.error('메모 저장 실패:', error);
                  alert('메모 저장 중 오류가 발생했습니다.');
                }
              }}
            >
              {isEditingMemo ? '저장' : '변경'}
            </Button>
          </Box>

          <TextField
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="메모를 입력하세요"
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            sx={{ mt: 1 }}
            InputProps={{ readOnly: !isEditingMemo }}
            disabled={!isEditingMemo}
          />
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={2}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setRefundReason('');
            setCustomReason('');
            setRefundModalOpen(true);
          }}
        >
          환불 처리
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            if (
              status === '환불_완료' ||
              status === '주문_취소' ||
              status === '배송_완료' ||
              status === '구매_확정'
            ) {
              alert(
                '이미 환불 완료, 주문 취소, 배송 완료, 구매확정 처리된 주문은 배송완료 처리를 할 수 없습니다.'
              );
              return;
            }
            setOpenDeliModal(true);
          }}
        >
          배송완료 처리
        </Button>

        {/* 배송완료 처리 확인 모달 */}
        <Dialog
          open={openDeliModal}
          onClose={() => setOpenDeliModal(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>배송완료 처리</DialogTitle>
          <DialogContent>
            <Typography>
              배송 현황 조회 후 실제로 배송이 완료된 경우에 진행해주세요. <br />
              배송 완료로 처리 후, 7일이 경과하면 구매 확정으로 전환됩니다.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => setOpenDeliModal(false)}>취소</Button>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await handleMarkDelivered();
                  alert(`배송 완료 처리되었습니다`);
                } catch (error) {
                  console.error('API 호출 오류:', error);
                  alert(`배송 완료 처리 중 오류가 발생했습니다.`);
                }
                setOpenDeliModal(false);
              }}
            >
              배송 완료 처리
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={refundModalOpen}
          onClose={() => setRefundModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>환불 처리</DialogTitle>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <FormControl fullWidth>
              <InputLabel>환불 사유</InputLabel>
              <Select
                label="환불 사유"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              >
                <MenuItem value="단순변심">단순변심</MenuItem>
                <MenuItem value="배송지연">배송지연</MenuItem>
                <MenuItem value="오배송">오배송</MenuItem>
                <MenuItem value="품절">품절</MenuItem>
                <MenuItem value="상품불량">상품불량</MenuItem>
                <MenuItem value="direct">직접입력</MenuItem>
              </Select>
            </FormControl>

            {refundReason === 'direct' && (
              <TextField
                label="직접입력"
                placeholder="환불 사유를 직접 입력하세요"
                multiline
                minRows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            <TextField
              label="환불 금액"
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value))}
              type="number"
              inputProps={{ min: 0 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setRefundModalOpen(false)}>취소</Button>
            <Button variant="contained" onClick={handleRefund}>
              저장
            </Button>
          </DialogActions>
        </Dialog>

        {/* 송장번호 등록 모달 */}
        <Dialog
          open={openTrackingModal}
          onClose={() => setOpenTrackingModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>송장번호 등록</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>택배사</InputLabel>
              <Select
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                label="택배사"
              >
                <MenuItem value="CJGLS">CJ대한통운</MenuItem>
                <MenuItem value="HYUNDAI">롯데택배</MenuItem>
                <MenuItem value="HANJIN">한진택배</MenuItem>
                <MenuItem value="EPOST">우체국택배</MenuItem>
                <MenuItem value="KGB">로젠택배</MenuItem>
                <MenuItem value="KDEXP">경동택배</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="송장번호"
              fullWidth
              variant="outlined"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTrackingModal(false)}>취소</Button>
            <Button
              onClick={async () => {
                // 택배사 및 송장번호 검증
                const trimmedTrackingNumber = String(
                  trackingNumber || ''
                ).trim();
                const trimmedCourier = String(selectedCourier || '').trim();

                if (!trimmedCourier || !trimmedTrackingNumber) {
                  alert('선택된 택배사 또는 입력된 송장번호가 없습니다');
                  return; // 저장하지 않고 함수 종료
                }

                try {
                  const isFirstRegistration =
                    !data?.trackingNumber || data.trackingNumber.trim() === '';

                  console.log('isFirstRegistration', isFirstRegistration);
                  await updateCarrierInfo({
                    orderIdx: parsedIdx!,
                    carrier: selectedCourier,
                    trackingNumber: trimmedTrackingNumber,
                  });

                  if (isFirstRegistration) {
                    await updateStatus(parsedIdx!, '배송중');
                    setStatus('배송중');
                    setTempStatus('배송중');
                  }

                  alert('송장번호가 저장되었습니다.');

                  setDelivery(selectedCourier);
                  setOpenTrackingModal(false);

                  await queryClient.invalidateQueries({
                    queryKey: ['orderDetail', parsedIdx],
                  });
                  await queryClient.invalidateQueries({ queryKey: ['orders'] });
                } catch (error) {
                  console.error('송장번호 저장 실패:', error);
                  alert('송장번호 저장 중 오류가 발생했습니다.');
                }
              }}
              variant="contained"
            >
              저장
            </Button>
          </DialogActions>
        </Dialog>

        <Popover
          open={Boolean(historyAnchorEl)}
          anchorEl={historyAnchorEl}
          onClose={() => setHistoryAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Paper
            sx={{
              p: 2,
              minWidth: 200,
              maxWidth: 300,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              상태변경 이력
            </Typography>

            {historyData.length > 0 ? (
              <Stack spacing={0.5}>
                {historyData.map((item, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                이력이 없습니다.
              </Typography>
            )}
          </Paper>
        </Popover>
      </Box>
    </Box>
  );
};

export default AppRegisterView;
