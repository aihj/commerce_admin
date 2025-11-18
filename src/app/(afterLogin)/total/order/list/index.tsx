'use client';

import {
  Box,
  FormGroup,
  TextField,
  FormControlLabel,
  Radio,
  Button,
  Card,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  InputLabel,
  Chip as MuiChip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ResetIcon } from '@/components/icons/ResetIcon'; 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { dayjs } from '@/lib/dayjs';
import type { Dayjs } from 'dayjs';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DTCellBox } from '@/components/DTCellBox';
import { PATH } from '@/paths';
// import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { logger } from '@/lib/logger/defaultLogger';
import { Loading } from '@/components/core/Loading';
import { PageTitle } from '@/components/core/PageTitle';
import { useRouter } from 'next/navigation';

import { useSelection } from '@/hooks/useSelection';

import {
  filterOrders,
  getAllOrders,
  OrderFilterParams,
  OrderListDTO,
  updateCarrierInfo,
  updateTaxStatus,
  exportOrders,
  markDelivered,
  updateStatus,
} from '@/api/orderApi';
import { getAllProducts }  from '@/api/productApi';
import { CHIP_COLOR, Chip } from '@/components/core/Chip';
import dayjs from 'dayjs';
import { taxInvoiceStatus } from '@/api/types/orderTypes';

const ConferenceAppRegisterList = () => {
  const [totalCount, setTotalCount] = useState<number>(20);
  const [userName, setUserName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderIdx, setSelectedOrderIdx] = useState<number | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [selectedTaxOrderIdx, setSelectedTaxOrderIdx] = useState<number | null>(
    null
  );
  const [tax, setTax] = useState<{
    requestT: string;
    businessNumber: string;
    email: string;
    request: string;
    status: 'none' | 'pending' | 'completed';
  }>({
    requestT: '',
    businessNumber: '',
    email: '',
    request: '',
    status: 'none'
  });
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedCourier, setSelectedCourier] = useState('');
  const queryClient = useQueryClient();

  
  const options1 = [
    '전체',
    '주문_완료',
    '상품_준비중',
    '배송중',
    '배송_완료',
    '환불_완료',
    '구매_확정',
    '주문_취소',
  ];
  const options2 = ['전체', '요청없음', '대기', '완료'];

  const router = useRouter();

  

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
  // 앱 노출 여부 디테일 페이지로 이동하기

  const moveOrderDetail = useCallback((orderIdx: number) => {
    router.push(PATH.TOTAL.ORDER.VIEW(orderIdx));
  }, []);
  const moveProductDetail = useCallback((productIdx: number) => {
    router.push(PATH.TOTAL.PRODUCT.VIEW(productIdx));
  }, []);

  const [draft, setDraft] = useState<OrderFilterParams>({
    taxBusinessNo: '',
    taxEmail: '',
    taxMemo: '',
    taxRequestT: '',
    sortType: 'o.create_t', 
    sortDir: 'DESC',
    page: 0,
    size: 50,
  });

  const [appliedParams, setAppliedParams] = useState<
    OrderFilterParams | undefined
  >(undefined);

  const queryKey = useMemo(
    () => ['orders', appliedParams ?? 'all'],
    [appliedParams]
  );

  const { data, isPending } = useQuery({
    queryKey,
    queryFn: () =>
      appliedParams ? filterOrders(appliedParams) : getAllOrders(),
  });


  useEffect(() => {


  console.log('selectedTaxOrderIdx', selectedTaxOrderIdx);
    if (openTaxModal && selectedTaxOrderIdx !== null) {
      const order = data?.find((item: OrderListDTO) => Number(item.orderIdx) === selectedTaxOrderIdx);
      console.log('order', order);
      if (order) {
        setTax({
          requestT: order.taxRequestT ? dayjs(order.taxRequestT).format('YYYY-MM-DD HH:mm:ss') : '',
          businessNumber: order.taxBusinessNo,
          email: order.taxEmail,
          request: order.taxMemo,
          status: order.taxInvoiceStatus as 'none' | 'pending' | 'completed',
        });
        console.log('tax',tax)
      } else {
        setTax({
          requestT: '',
          businessNumber: '',
          email: '',
          request: '',
          status: 'none',
        });
      }
    }
  }, [openTaxModal, selectedTaxOrderIdx, data]);


  console.log('tax',tax)
  const onSearch = () => {
    const trimmedUserName = userName.trim();
    const trimmedOrderId = orderId.trim();

    type TaxLabel = keyof typeof taxInvoiceStatus;

    const isTaxLabel = (s: string): s is TaxLabel => s in taxInvoiceStatus;


    const updated = {
      ...draft,
      // 텍스트 필드가 비었으면 null
      userName: trimmedUserName !== '' ? trimmedUserName : null,
      orderId: trimmedOrderId !== '' ? trimmedOrderId : null,
      orderStatuses: selected.orderStatuses.includes('전체') ? null : selected.orderStatuses,
      taxInvoiceStatuses:
      selected.taxInvoiceStatuses.includes('전체')
        ? null
        : selected.taxInvoiceStatuses
          .filter(isTaxLabel)
          .map((k) => taxInvoiceStatus[k as TaxLabel]),
      
      startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
      endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
    };

    // 서버 전달용으로 prune 처리
    const cleaned = prune(updated);
    console.log('cleaned', cleaned);
    console.log('selected', selected);
    setAppliedParams(Object.keys(cleaned).length ? cleaned : undefined);
  };

  const [selected, setSelected] = useState<{
    productNames: string[];
    orderStatuses: string[];
    taxInvoiceStatuses: string[];
  }>({
    productNames: ['전체'],
    orderStatuses: ['전체'],
    taxInvoiceStatuses: ['전체'],
  });


    
  const idxList = useMemo(
    () => data?.map((item: OrderListDTO) => item.orderIdx) ?? [],
    [data]
  );


  const { selected: selectedIdxList, selectAll, deselectAll, selectOne, deselectOne } = useSelection<number>(idxList);
  const selectedOrderIdxArray = useMemo(
    () => Array.from(selectedIdxList),
    [selectedIdxList]
  );
  
  const { data: allProducts } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => getAllProducts(),
  });

  const productNameList = useMemo(() => {
    if (!allProducts) return [];
    return Array.from(new Set(allProducts.map((product) => product.productName).filter(Boolean)));
  }, [allProducts]);

  const options0 = ['전체', ...productNameList];

 
  const handleExport = async () => {
    await exportOrders(idxList as unknown as number[]);
  };

  const handleMarkDelivered = async () => {
    if(selectedOrderIdxArray.length === 0) {
      alert('선택된 주문이 없습니다');
      return;
    }

    // 조건에 맞는 orderIdx만 필터링 (배송중 또는 상품_준비중)
    const validOrder = selectedOrderIdxArray.filter((orderIdx) => {
      const order = data?.find((item: OrderListDTO) => Number(item.orderIdx) === orderIdx);
      return order?.orderStatus === '배송중' || order?.orderStatus === '상품_준비중';
    });

    // 조건에 맞지 않는 주문이 있는 경우 알림
    if (validOrder.length < selectedOrderIdxArray.length) {
      const invalidCount = selectedOrderIdxArray.length - validOrder.length;
      alert(`주문 상태가 상품 준비중 또는 배송중인 주문만 배송완료 처리가 가능합니다.`);
      return;
    }

    await markDelivered(validOrder);
    alert(`배송 현황 조회 후 실제로 배송이 완료된 경우에 진행해주세요.
      배송 완료로 처리후, 7일이 경과하면 구매 확정으로 전환됩니다.`)
    await queryClient.invalidateQueries({
      queryKey: ['orders'],
    });
  };

  // 공용 토글 함수
  const handleClick = (
    option: string,
    key: 'productNames' | 'orderStatuses' | 'taxInvoiceStatuses'
  ) => {
    setSelected((prev) => {
      const prevForKey = prev[key] || [];
      let next;

      if (option === '전체') {
        next = ['전체'];
      } else {
        next = prevForKey.includes(option)
          ? prevForKey.filter((o) => o !== option)
          : [...prevForKey.filter((o) => o !== '전체'), option];
      }

      const nextSelected = { ...prev, [key]: next };

      setDraft((d) => ({
        ...d,
        [key]: next.includes('전체') || next.length === 0 ? null : next,
      }));

      return nextSelected;
    });
  };



  const columnHelper = createColumnHelper<OrderListDTO>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('createT', {
        header: '주문일시',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{dayjs(info.getValue()).format('YYYY-MM-DD')}</span>
            </DTCellBox>
          );
        },
        size: 120,
      }),
      columnHelper.accessor('orderId', {
        header: '주문번호',
        cell: (info) => {
          return (
            <DTCellBox>
              <Button
                sx={{
                  border: 0,
                  textDecoration: 'underline',
                  textUnderlinePosition: 'under',
                }}
                onClick={() => {
                  moveOrderDetail(info.row.original.orderIdx as unknown as number);
                }}
                title={`${info.getValue()}`}
              >
                {`${info.getValue()}`}
              </Button>
            </DTCellBox>
          );
        },
        size: 180,
      }),

      columnHelper.accessor('userName', {
        header: '주문자',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue()}</span>
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('userContactNumber', {
        header: '주문자 휴대폰 번호',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue()}</span>
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('productName', {
        header: '주문상품',
        cell: (info) => {
          return (
            <DTCellBox>
              <Button
                sx={{
                  border: 0,
                  textDecoration: 'underline',
                  textUnderlinePosition: 'under',
                }}
                onClick={() => {
                  moveProductDetail(info.row.original.productIdx);
                }}
                title={`${info.row.original.productName}`}
              >
                {`${info.getValue()}`}
              </Button>
            </DTCellBox>
          );
        },
      }),

      columnHelper.accessor('quantity', {
        header: '주문수량',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue()}</span>
            </DTCellBox>
          );
        },
        size: 60,
      }),

      columnHelper.accessor('orderAmount', {
        header: '결제금액',
        cell: (info) => (
          <DTCellBox>
            <span>{info.getValue()}</span>
          </DTCellBox>
        ),
       
      }),

      columnHelper.accessor('orderStatus', {
        header: '주문상태',
        cell: (info) => {
          const status = info.getValue() || '';
          let statusText = status;
          let chipColor: CHIP_COLOR = CHIP_COLOR.neutral;

          // 주문상태에 따른 색상 매핑
          if (status === '주문_완료') {
            chipColor = CHIP_COLOR.primary;
          } else if (status === '상품_준비중') {
            chipColor = CHIP_COLOR.primaryl;
          } else if (status === '배송중') {
            chipColor = CHIP_COLOR.info;
          } else if (status === '배송_완료') {
            chipColor = CHIP_COLOR.success;
          } else if (status === '환불_완료') {
            chipColor = CHIP_COLOR.warning;
          } else if (status === '구매_확정') {
            chipColor = CHIP_COLOR.secondary;
          } else if (status === '주문_취소') {
            chipColor = CHIP_COLOR.error;
          }

          return (
            <DTCellBox>
              <Chip type="soft" color={chipColor} label={statusText} />
            </DTCellBox>
          );
        },
        size: 100,
      }),

      columnHelper.accessor('taxInvoiceStatus', {
        header: '세금 계산서 처리 상태',
        cell: (info) => {
          const status = info.row.original.taxInvoiceStatus || 'none';

          let statusText: string = '요청 없음';
          let chipColor: CHIP_COLOR = CHIP_COLOR.warning;

          if (status === 'pending') {
            statusText = '대기';
            chipColor = CHIP_COLOR.info;
          } else if (status === 'completed') {
            statusText = '완료';
            chipColor = CHIP_COLOR.success;
          }

          return (
            <DTCellBox>
              <Chip type="soft" color={chipColor} label={statusText} />
            </DTCellBox>
          );  
        },
      }),

      // 새로 추가할 액션 컬럼들
      columnHelper.display({
        id: 'action1',
        header: '',
        cell: (info) => {
          const order = info.row.original;
          const tracking =
            info.row.original.trackingNumber ?? info.row.original.trackingNumber;
          const hasTracking = Boolean(tracking);
          
          return (
            <DTCellBox>
              <Button
                variant={hasTracking ? 'contained' : 'outlined'}
                size="small"
               
                sx={
                  hasTracking
                ? {
                    backgroundColor: 'black',
                    color: '#fff',
                    // disabled 상태에서도 색상 유지
                    '&.Mui-disabled': {
                      backgroundColor: 'white',
                      color: 'light-gray',
                      borderColor: 'dark-gray',
                      opacity: 1,
                    },
                  }
                : {
                    backgroundColor: 'white',
                    color: 'black',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    // disabled 상태 스타일
                    '&.Mui-disabled': {
                      backgroundColor: 'white',
                      color: 'light-gray',
                      borderColor: 'dark-gray',
                      opacity: 1,
                    },
                  }
                }
                disabled={info.row.original.orderStatus === '주문_취소' || info.row.original.orderStatus == '환불_완료' || info.row.original.orderStatus == '구매_확정'}
                onClick={() => {
                 
                  setSelectedOrderIdx(info.row.original.orderIdx);
                  setSelectedCourier(order.carrierName ?? '');  // ← 행 데이터 사용
                  setTrackingNumber(tracking);
                  setOpenModal(true);
                }}
              >
                {hasTracking ? '송장번호 변경' : '송장번호 등록'}
              </Button>
            </DTCellBox>
          );
        },
        size: 120,
      }),

      columnHelper.display({
        id: 'action2',
        header: '',
        cell: (info) => {
          const order = info.row.original;
          const taxStatus = order.taxInvoiceStatus || 'none';
          const isCompleted = taxStatus === 'completed';
          
          return (
            <DTCellBox>
              <Button
                variant="outlined"
                size="small"
                disabled={info.row.original.orderStatus !== '구매_확정'}
                sx={
                  isCompleted
                    ? {
                      backgroundColor: 'white',
                      color: 'black',
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                      
                        '&.Mui-disabled': {
                          backgroundColor: 'white',
                          color: 'light-gray',
                        },
                      }
                    : {
                      backgroundColor: 'white',
                      color: 'black',
                      borderColor: 'rgba(0, 0, 0, 0.23)',

                      '&.Mui-disabled': {
                        backgroundColor: 'white',
                        color: 'light-gray',
                      },
                      }
                }
                onClick={() => {
                  setSelectedTaxOrderIdx(info.row.original.orderIdx);                  
                  setOpenTaxModal(true);                  
                }}
              >
                세금계산서 처리
              </Button>
            </DTCellBox>
          );
        },
        size: 130,
      }),
    ],
    [columnHelper, moveOrderDetail, moveProductDetail]
  );

  const handleUpdateTaxStatus = async (newTaxStatus: string, closeModal?: boolean) => {
    try {
      await updateTaxStatus({
        orderIdx: selectedTaxOrderIdx!,
        status: newTaxStatus,
      });

      alert(`세금 계산서 처리 상태가 ${newTaxStatus}으로 변경되었습니다`);

      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
      if (closeModal) {
        setOpenTaxModal(false);
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert(`${newTaxStatus}로 변경 중 오류가 발생했습니다.`);
    }
  };


  // useEffect 추가 (컴포넌트 상단에)
  
  console.log('data', data);
  return (
    <Box
      sx={{
        maxWidth: '100rem',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: '100rem',
        ml: '6rem'
        
      }}
    >
      {isPending && <Loading open={isPending} />}
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box sx={{ flex: '1 1 auto ' }}>
            <PageTitle title="주문 리스트" />
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', ml: 2, gap: '1rem', }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              상품
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                width: '12rem',
                height: '8rem',
                borderRadius: 1,
                overflowY: 'scroll'
    
              }}
            >
              {options0.map((option) => (
                <Box
                  key={option}
                  sx={{
                    p: 0.5,
                    cursor: 'pointer',
                    backgroundColor: selected.productNames.includes(option)
                      ? '#e3f2fd'
                      : 'transparent',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                  onClick={() => handleClick(option, 'productNames')}
                >
                  {option}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              주문 상태
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                width: '12rem',
                borderRadius: 1,
                height: 'calc(4 * 2rem)',
                overflow: 'auto',
              }}
            >
              {options1.map((option) => (
                <Box
                  key={option}
                  sx={{
                    p: 0.5,
                    cursor: 'pointer',
                    backgroundColor: selected.orderStatuses.includes(option)
                      ? '#e3f2fd'
                      : 'transparent',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                  onClick={() => handleClick(option, 'orderStatuses')}
                >
                  {option}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              세금계산서 처리 상태
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                width: '12rem',
                borderRadius: 1,
                maxHeight: 'calc(4 * 2rem)',
                overflow: 'auto',
              }}
            >
              {options2.map((option) => (
                <Box
                  key={option}
                  sx={{
                    p: 0.5,
                    cursor: 'pointer',
                    backgroundColor: selected.taxInvoiceStatuses.includes(
                      option
                    )
                      ? '#e3f2fd'
                      : 'transparent',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                  onClick={() => handleClick(option, 'taxInvoiceStatuses')}
                >
                  {option}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, width: '12rem' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            주문일(시작)
            </Typography>
              <DatePicker
                
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { width: '100%' },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1, width: '12rem' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            주문일(종료)
            </Typography>
              <DatePicker
               
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { width: '100%' },
                  },
                }}
              />
            </Box>
            <Box sx={{ width: '12rem' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            주문자
            </Typography>
              <TextField
                placeholder="주문자 입력"
                variant="outlined"
                size="small"
                sx={{ width: '100%' }}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch();
                  }
                }}
              />
            </Box>
            <Box sx={{ width: '12rem' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            주문번호
            </Typography>
              <TextField
                placeholder="주문번호 입력"
                variant="outlined"
                size="small"
                sx={{ width: '100%' }}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch();
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', width: '92%', alignItems: 'center', gap: 1,  ml: 2 }}>
          <Box
            sx={{
              flex: 1,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              padding: '0.4rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minHeight: '2.5rem',
              
            }}
          >
            <Typography variant="body2" sx={{  fontWeight: 'bold' }}>
              선택된 항목
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              {selected.productNames
                .filter((item) => item !== '전체')
                .map((item) => (
                  <MuiChip
                    key={`product-${item}`}
                    label={item}
                    size="small"
                    onDelete={() => handleClick(item, 'productNames')}
                    deleteIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ height: '1.5rem' }}
                  />
                ))}
              {selected.orderStatuses
                .filter((item) => item !== '전체')
                .map((item) => (
                  <MuiChip
                    key={`order-${item}`}
                    label={item}
                    size="small"
                    onDelete={() => handleClick(item, 'orderStatuses')}
                    deleteIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ height: '1.5rem' }}
                  />
                ))}
              {selected.taxInvoiceStatuses
                .filter((item) => item !== '전체')
                .map((item) => (
                  <MuiChip
                    key={`tax-${item}`}
                    label={item}
                    size="small"
                    onDelete={() => handleClick(item, 'taxInvoiceStatuses')}
                    deleteIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ height: '1.5rem' }}
                  />
                ))}
            </Box>
          </Box>
          <IconButton
            color="secondary"
            onClick={() => {
              setSelected({
                productNames: ['전체'],
                orderStatuses: ['전체'],
                taxInvoiceStatuses: ['전체'],
              });
              setStartDate(null);
              setEndDate(null);
              setUserName('');
              setOrderId('');
            }}
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ResetIcon />
          </IconButton>

          <Button
            variant="contained"
            color="secondary"
            sx={{ height: '2.5rem' }}
            onClick={onSearch}
          >
            검색
          </Button>
        </Box>

        <Card sx={{ width: '101%', minWidth: '80vh' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              padding: '1rem',
              paddingBottom: '0.5rem',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                color: '#4caf50',
                borderColor: '#4caf50',
                padding: '6px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.04)',
                  borderColor: '#45a049',
                  color: '#45a049',
                },
              }}
              onClick={() => {
                 handleExport();
              }}
            >
              주문서 엑셀 다운로드(조회된 모든 주문)
            </Button>

            <Button
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                color: '#1a237e',
                borderColor: '#1a237e',
                padding: '6px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(26, 35, 126, 0.04)',
                  borderColor: '#000051',
                  color: '#000051',
                },
              }}
              onClick={() => {
                  handleMarkDelivered();
              }}
            >
              일괄 배송완료 처리(선택 주문)
            </Button>
          </Box>
        
          <TableBody<OrderListDTO>
            data={data as OrderListDTO[]}
            columns={columns as ColumnDef<OrderListDTO>[]}
            selectable={true}
            hideHead={false}
            uniqueRowId={(row: OrderListDTO) => row.orderIdx as number}
            isHover={true}
            noDataMessage={'주문 내역이 없습니다.'}
            selected={selectedIdxList}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onSelectOne={(rowId) => {
              selectOne(rowId as number);
            
              const order = (data as OrderListDTO[] | undefined)?.find(
                (item) => item.orderIdx === rowId
              );
            
            }}
            onDeselectOne={(rowId) => {
              deselectOne(rowId as number);
             
            }}
            
          />
        </Card>
        {/* 송장번호 등록 모달 */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>송장번호 등록</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>택배사</InputLabel>
              <Select
                value={selectedCourier || ''}
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
              value={trackingNumber || ''}
              onChange={(e) => {
              
                setTrackingNumber(e.target.value);}}

              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>취소</Button>
            <Button
              onClick={async () => {
                // 택배사 및 송장번호 검증
                const trimmedTrackingNumber = String(trackingNumber || '').trim();
                const trimmedCourier = String(selectedCourier || '').trim();
                
                if (!trimmedCourier || !trimmedTrackingNumber) {
                  alert('선택된 택배사 또는 입력된 송장번호가 없습니다');
                  return; 
                }
                
                try {

                  const order = data?.find((item: OrderListDTO) => Number(item.orderIdx) === selectedOrderIdx);
                  const isFirst = !order?.trackingNumber || order?.trackingNumber.trim() === '';
               

                  await updateCarrierInfo({
                    orderIdx: selectedOrderIdx!,
                    carrier: trimmedCourier,
                    trackingNumber: trimmedTrackingNumber,
                  });
                 
                  if(isFirst) {
                    await updateStatus(selectedOrderIdx!, '배송중');
                    alert(`송장번호가 저장되었으며 주문 상태가 배송중으로 변경되었습니다`);
                  }else {
                    alert('송장번호가 변경되었습니다.');
                  }

                  await queryClient.invalidateQueries({ queryKey: ['orders'] });

                setOpenModal(false);
                setTrackingNumber('');
                setSelectedCourier('');
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

        {/* 세금계산서 처리 모달 */}
        <Dialog
          open={openTaxModal}
          onClose={() => setOpenTaxModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>세금계산서 처리</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>

            <Stack spacing={1} sx={{ ml: 1.5 }}>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ minWidth: '150px' }}>요청일시</Box>
                <Box> {tax.requestT}</Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ minWidth: '150px' }}>사업자 등록번호</Box>
                <Box> {tax.businessNumber}</Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                  <Box sx={{ minWidth: '150px' }}>이메일 주소</Box>
                  <Box> {tax.email}</Box>
              </Box>
              <Box sx={{ display: 'flex' }
            }>
                <Box sx={{ minWidth: '150px' }}>요청 사항</Box>
                <Box> {tax.request}</Box>
              </Box>
            </Stack>

              <InputLabel sx={{ mt: 2 }}>처리 상태</InputLabel>
             
                <Select
                  value={tax.status || 'none'}
                  onChange={(e) => setTax({
                    ...tax,
                    status: e.target.value as 'none' | 'pending' | 'completed',
                  })}
                  label="처리 상태"
                >
                  <MenuItem value="none">요청없음</MenuItem>
                  <MenuItem value="pending">대기</MenuItem>
                  <MenuItem value="completed">완료</MenuItem>
                </Select>
              
              
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTaxModal(false)}>취소</Button>
            <Button
                variant="outlined"
                size="small"
                onClick={async () => {
                  try {
                    await handleUpdateTaxStatus(tax.status as 'none' | 'pending' | 'completed');
                    setOpenTaxModal(false);
                  } catch (error) {
                  }
                }}
              >
                저장
              </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export { ConferenceAppRegisterList };
