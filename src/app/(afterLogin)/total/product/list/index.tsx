'use client';

import {
  Box,
  Button,
  Card,
  Stack,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  FormGroup,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import { ResetIcon } from '@/components/icons/ResetIcon';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DTCellBox } from '@/components/DTCellBox';
import { PATH } from '@/paths';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loading } from '@/components/core/Loading';
import { PageTitle } from '@/components/core/PageTitle';
import { useRouter } from 'next/navigation';
import { dayjs } from '@/lib/dayjs';
import {
  filterProducts,
  ProductDTO,
  ProductFilterParams,
  getAllProducts,
  createProduct,
} from '@/api/productApi';
import CloseIcon from '@mui/icons-material/Close';

const ConferenceAppRegisterList = () => {
  const [selected, setSelected] = useState('전체');
  const options = ['전체', '대기', '판매중', '판매종료', '판매취소'];
  const router = useRouter();
  const [totalCount, setTotalCount] = useState<number>(20);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('EVT');
  const [productNameSearch, setProductNameSearch] = useState('');
  const [productIdSearch, setProductIdSearch] = useState('');
  const [name, setName] = useState('');
  // 앱 노출 여부 디테일 페이지로 이동하기
  const moveAppExposureDetail = useCallback((conferenceIdx: number) => {
    router.push(PATH.TOTAL.PRODUCT.VIEW(conferenceIdx));
  }, []);

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

  const [draft, setDraft] = useState<ProductFilterParams>({
    currentPage: 0,
    rowsPerPage: 10,
    sortType: 'p.create_t',
    sortDir: 'DESC',
  });

  const [appliedParams, setAppliedParams] = useState<
    ProductFilterParams | undefined
  >({
    currentPage: 0,
    rowsPerPage: 10,
    sortType: 'p.create_t',
    sortDir: 'DESC',
  });

  const queryKey = useMemo(
    () => ['products', JSON.stringify(appliedParams)],
    [appliedParams]
  );

  // 필터가 있는지 확인하는 함수
  const hasFilters = useCallback((params: ProductFilterParams | undefined) => {
    if (!params) return false;
    const filterKeys: (keyof ProductFilterParams)[] = [
      'productName',
      'productIdx',
      'productStatus',
      'saleStatus',
      'userId',
      'orderId',
    ];
    return filterKeys.some(
      (key) => params[key] !== null && params[key] !== undefined
    );
  }, []);

  // TablePagination을 위한 setCSearchParamsFunc
  const setCSearchParamsFunc = useCallback(
    (param: Partial<ProductFilterParams>) => {
      const key = Object.keys(param)[0];
      const updatedParam: Partial<ProductFilterParams> = { ...param };

      // rowsPerPage가 문자열로 오면 숫자로 변환
      if (
        'rowsPerPage' in updatedParam &&
        typeof updatedParam.rowsPerPage === 'string'
      ) {
        updatedParam.rowsPerPage = Number(updatedParam.rowsPerPage);
      }

      if (key !== 'currentPage') {
        updatedParam.currentPage = 0;
      }

      setAppliedParams((prev) => {
        const newParams = { ...prev!, ...updatedParam };
        // 디버깅을 위한 로그
        console.log('setAppliedParams:', newParams);
        return newParams;
      });
    },
    []
  );

  const queryClient = useQueryClient();

  const makeProductId = (
    productCategory: string | null | undefined,
    productIdx: number | undefined
  ): string => {
    if (!productCategory || !productIdx) return '-';

    const paddedIdx = String(productIdx).padStart(4, '0');

    return `${productCategory}${paddedIdx}`;
  };

  // extractProductIdx 함수를 컴포넌트 레벨로 이동
  const extractProductIdx = (value: string): number | null => {
    if (!value) return null;
    const numbers = value.replace(/\D/g, '');
    if (numbers === '') return null;

    const parsed = parseInt(numbers, 10);
    return isNaN(parsed) ? null : parsed;
  };

  const onSearch = () => {
    const trimmedName = productNameSearch.trim();
    const trimmedId = productIdSearch.trim();

    const updated = {
      ...draft, // draft의 saleStatus 등 모든 필터 정보 포함
      currentPage: 0,
      productName: trimmedName !== '' ? trimmedName : null,
      productIdx: trimmedId !== '' ? extractProductIdx(trimmedId) : null,
    };

    const cleaned = prune(updated);
    console.log('cleaned', cleaned);
    setAppliedParams(cleaned); // 여기서만 필터 적용
    setDraft(updated);
  };

  const handleRefresh = () => {
    setSelected('전체');
    setProductNameSearch('');
    setProductIdSearch('');

    setDraft({
      currentPage: 0,
      rowsPerPage: 10,
      sortType: 'p.create_t',
      sortDir: 'DESC',
    });

    setAppliedParams({
      currentPage: 0,
      rowsPerPage: 10,
      sortType: 'p.create_t',
      sortDir: 'DESC',
    });
  };

  const handleClick = (saleStatus: string) => {
    setSelected(() => {
      let next;
      if (saleStatus === '전체') {
        next = '전체';
      } else {
        next = saleStatus;
      }

      const updatedDraft = {
        ...draft,
        saleStatus: saleStatus === '전체' ? null : saleStatus,
        currentPage: 0, // 필터 변경 시 첫 페이지로 리셋
      };
      setDraft(updatedDraft);

      return next;
    });
  };

  const { data, isPending } = useQuery<ProductDTO[]>({
    queryKey,
    queryFn: async () => {
      const params = appliedParams!;

      // 필터가 없으면 getAllProducts로 전체 데이터 가져오기
      if (!hasFilters(params)) {
        const allProducts = await getAllProducts();
        setTotalCount(allProducts.length);

        // 먼저 정렬
        const sorted = [...allProducts].sort((a, b) => {
          const aTime = new Date(a.createT).getTime();
          const bTime = new Date(b.createT).getTime();
          return params.sortDir === 'ASC' ? aTime - bTime : bTime - aTime;
        });

        const start = (params.currentPage || 0) * (params.rowsPerPage || 10);
        const end = start + (params.rowsPerPage || 10);
        return sorted.slice(start, end);
      } else {
        // 필터가 있으면 filterProducts 사용
        const result = await filterProducts(params);
        setTotalCount(result.totalCount);
        return result.content;
      }
    },
  });

  console.log('data', data);

  const columnHelper = createColumnHelper<ProductDTO>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('productIdx', {
        header: '상품ID',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>
                {makeProductId(
                  info.row.original.productCategory,
                  info.row.original.productIdx
                )}
              </span>
            </DTCellBox>
          );
        },
        size: 60,
      }),
      columnHelper.accessor('productName', {
        header: '상품명',
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
                  moveAppExposureDetail(info.row.original.productIdx);
                }}
                title={`${info.row.original.productName}`}
              >
                {`${info.getValue()}`}
              </Button>
            </DTCellBox>
          );
        },
      }),

      columnHelper.accessor('costPrice', {
        header: '공급가',
        cell: (info) => (
          <DTCellBox>
            <span>{`${info.getValue()}`}</span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('productPrice', {
        header: '판매가',
        cell: (info) => (
          <DTCellBox>
            <span>{`${info.getValue()}`}</span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('defaultShippingFee', {
        header: '배송비',
        cell: (info) => (
          <DTCellBox>
            <span>{`${info.getValue()}`}</span>
          </DTCellBox>
        ),
      }),

      columnHelper.accessor('launchStartT', {
        header: '판매기간',
        cell: (info) => (
          <DTCellBox>
            <span>
              {dayjs(info.row.original.launchStartT).format('YYYY-MM-DD')} -{' '}
              {dayjs(info.row.original.launchEndT).format('YYYY-MM-DD')}
            </span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('stockQuantity', {
        header: '남은 재고수량',
        cell: (info) => (
          <DTCellBox>
            <span>{`${info.getValue()}`}</span>
          </DTCellBox>
        ),
      }),

      columnHelper.accessor('stockQuantity', {
        header: '재고 상태',
        cell: (info) => {
          const stockQuantity = info.getValue();
          const status = stockQuantity >= 1 ? '판매가능' : '품절';

          return (
            <DTCellBox>
              <span>{status}</span>
            </DTCellBox>
          );
        },
      }),

      columnHelper.accessor('saleStatus', {
        header: '등록 상태',
        cell: (info) => {
          // const status = info.row.original.saleStatus;

          // 상태에 따른 텍스트 및 색상 결정
          // let statusText: string;
          // let chipColor: CHIP_COLOR; // 기본 색상

          // if (status === 'pending') {
          //   statusText = '대기';
          //   chipColor = CHIP_COLOR.warning;
          // } else if (status === 'active') {
          //   statusText = '등록';
          //   chipColor = CHIP_COLOR.success;
          // } else {
          //   statusText = '등록안함';
          //   chipColor = CHIP_COLOR.error;
          // }

          return (
            <DTCellBox>
              <span>{info.getValue()}</span>
              {/* <Chip type="soft" color={chipColor} label={statusText} /> */}
            </DTCellBox>
          );
        },
      }),
    ],
    [columnHelper, moveAppExposureDetail]
  );

  const handleRegister = async () => {
    try {
      await createProduct({
        name: name,
        category: selectedCategory,
      });

      alert('상품이 성공적으로 등록되었습니다.');

      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
      setOpenModal(false);
      setName('');
      setSelectedCategory('');
      // 필요하다면 queryClient.invalidateQueries로 리스트 새로고침
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
        ml: '6rem',
      }}
    >
      {isPending && <Loading open={isPending} />}
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: 'column' }}
        >
          <Box sx={{ flex: '1' }}>
            <PageTitle title="상품 리스트" />
          </Box>
        </Stack>

        <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                등록 상태
              </Typography>

              <FormControl fullWidth sx={{ width: '14vh' }}>
                <Select
                  value={selected}
                  onChange={(e) => handleClick(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <FormGroup sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6">상품명</Typography>
                    <TextField
                      placeholder="상품명 입력"
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1, maxWidth: '300px' }}
                      value={productNameSearch}
                      onChange={(e) => setProductNameSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          onSearch();
                        }
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6">상품ID</Typography>
                    <TextField
                      placeholder="상품ID 입력"
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1, maxWidth: '300px' }}
                      value={productIdSearch}
                      onChange={(e) => setProductIdSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          onSearch();
                        }
                      }}
                    />
                  </Box>
                </Box>
              </FormGroup>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minHeight: '2.5rem',
                width: '27rem',
                mr: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                선택된 항목
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {selected !== '전체' && (
                  <Chip
                    label={selected}
                    size="small"
                    onDelete={() => handleClick('전체')}
                    deleteIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ height: '1.5rem' }}
                  />
                )}
              </Box>
            </Box>

            <IconButton
              color="secondary"
              onClick={handleRefresh}
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
        </Box>

        <Card>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              ml: 2,
              mb: 2,
            }}
          >
            <TablePagination<ProductFilterParams>
              cSearchParams={appliedParams!}
              setCSearchParamsFunc={setCSearchParamsFunc}
              totalCount={totalCount}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenModal(true)}
              sx={{ mr: 5 }}
            >
              상품 등록
            </Button>
            <Dialog
              open={openModal}
              onClose={() => setOpenModal(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>상품 등록</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <InputLabel>카테고리 선택</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="카테고리 선택"
                    sx={{ width: '20vh' }}
                  >
                    <MenuItem value="STD">상시판매</MenuItem>
                    <MenuItem value="EVT">이벤트</MenuItem>
                    <MenuItem value="MED">의료 소모품</MenuItem>
                    <MenuItem value="GBH">공동구매(병원장)</MenuItem>
                  </Select>

                  <InputLabel>상품명</InputLabel>
                  <TextField
                    placeholder="상품명 입력"
                    variant="outlined"
                    size="small"
                    sx={{ mt: -1, width: '20vh' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)}>취소</Button>
                <Button
                  onClick={handleRegister}
                  variant="contained"
                  disabled={!selectedCategory || !name}
                >
                  등록
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <TableBody<ProductDTO>
            data={data as ProductDTO[]}
            columns={columns as ColumnDef<ProductDTO>[]}
            selectable={false}
            hideHead={false}
            uniqueRowId={(row: ProductDTO) => row.productIdx as number}
            isHover={true}
            noDataMessage={'등록된 상품이 없습니다.'}
          />
        </Card>
      </Stack>
    </Box>
  );
};

export { ConferenceAppRegisterList };
