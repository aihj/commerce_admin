'use client';
// import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Table from '@mui/material/Table';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import { PageTitle } from '@/components/core/PageTitle';
import { dayjs } from '@/lib/dayjs';

import * as React from 'react';
import { Button, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, IconButton, InputAdornment, Stack, Popover, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CHIP_COLOR, Chip } from '@/components/core/Chip';
import { useState, useEffect, useRef } from 'react';
import { UpdateSupplierRequest, 
  getProductDetail, updateSupplier, 
  updateStock, updateSale, updateProductStatus, 
  deleteProductFile, uploadProductFile, getProductStatusHistory, getStockStatusHistory } from '@/api/productApi';
import { DateTimePicker } from '@mui/x-date-pickers';
import { PRODUCT_CATEGORY } from '@/api/types/productTypes';


const AppRegisterView = () => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState({ thumbnail: false, 
    detail: false, status: false, sale: false, stock: false, supplier: false });

  const [imagePreview, setImagePreview] = useState<{ thumbnail: string, detail: string }>({ thumbnail: '', detail: '' });
 
  const [supplierData, setSupplierData] = useState({
    supplierName: '',
    managerName: '',
    managerPhone: '',
    returnAddr: '',
  });

  const [saleData, setSaleData] = useState({
    productName: '',
    costPrice: 0,
    consumerPrice: 0,
    productPrice: 0,
    defaultShippingFee: 0,
    remoteShippingFee: 0,  
    jejuShippingFee: 0,
    launchStartT: '',
    launchEndT: ''
  });

  const [stockData, setStockData] = useState({
    maxQuantity: '',
    stockQuantity: '',
  });

  const [stockIncrement, setStockIncrement] = useState(''); // 증감량 state 추가

  const { productIdx } = useParams<{ productIdx: string }>();
  

  // 💡 숫자로 변환
  const parsedIdx = productIdx ? parseInt(productIdx, 10) : undefined;

  const { data } = useQuery({
    queryKey: ['productDetail', parsedIdx],
    queryFn: () => getProductDetail(parsedIdx!),
    enabled: !!parsedIdx, // parsedIdx가 있을 때만 실행
  });

  console.log('data', data);

  const extractFileName = (path?: string | null) => {
    if (!path) return '';
    const segments = path.split('/');
    return segments[segments.length - 1] ?? '';
  };

  const [status, setStatus] = useState<string>(data?.saleStatus || '');
 
    const [image, setImage] = useState<{ thumbnail: string; detail: string }>({
    thumbnail: extractFileName(data?.thumbUrl),
    detail: extractFileName(data?.detailUrl),
  });

  const [imageFiles, setImageFiles] = useState<{ thumbnail: File | null, detail: File | null }>({
    thumbnail: null,
    detail: null,
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [historyAnchorEl, setHistoryAnchorEl] = useState<HTMLButtonElement | null>(null);
  // 1) 상태 선언 변경
  const [historyData, setHistoryData] = useState<{
    status?: string[];
    stock?: string[];
  }>({});

  const[historyType, setHistoryType] = useState<'status' | 'stock'>('status');

  useEffect(() => {
    if (data?.saleStatus) {
      setStatus(data.saleStatus);
    }
    if (data?.thumbUrl) {
      setImage((prev) => ({ ...prev, thumbnail: extractFileName(data.thumbUrl) }));
      setImagePreview((prev) => ({ ...prev, thumbnail: data.thumbUrl || '' }));
    }
    if (data?.detailUrl) {
      setImage((prev) => ({ ...prev, detail: extractFileName(data.detailUrl) }));
      setImagePreview((prev) => ({ ...prev, detail: data.detailUrl || '' }));
    }

    if(data?.launchStartT) {
      setSaleData((prev) => ({ ...prev, launchStartT: data.launchStartT || '' }));
    }
    if(data?.launchEndT) {
      setSaleData((prev) => ({ ...prev, launchEndT: data.launchEndT || '' }));
    }
   
  }, [data]);



  // async function changeAppExposureStatus(param: {
  //   productIdx: number;
  //   desiredStatus: string;
  // }) {
  //   try {
  //     const result = await changeAppExposureStatusAPI(param);
  //     await queryClient.invalidateQueries({
  //       queryKey: ['getAppConferenceDetail', productIdx],
  //     });
  //     await queryClient.invalidateQueries({
  //       queryKey: ['getAppConferenceList'],
  //     });
  //     return result;
  //   } catch (error) {
  //     console.error('Mutation error:', error);
  //     throw error;
  //   }
  // }

  // if (isPending || error) {
  //   return <PageLoading />;
  // }
  // const supportStatusMap: Record<
  //   'online_offline' | 'online_only' | 'offline_only',
  //   string
  // > = {
  //   online_offline: '(온라인 + 오프라인)',
  //   online_only: '(온라인만)',
  //   offline_only: '(오프라인만)',
  // };

  // const getApplyStatus: Record<'active' | 'apply' | 'delete', string> = {
  //   active: '등록',
  //   apply: '대기',
  //   delete: '등록안함',
  // };

  const getSaleChipColor = (status: 'pending' | 'active' | 'inactive') => {
    if (status === 'inactive') {
      return CHIP_COLOR.warning;
    } else if (status === 'pending') {
      return CHIP_COLOR.success;
    } else {
      return CHIP_COLOR.error;  
    }
  };

  

  const menuOptions = [
    {
      label: '대기',
      value: 'pending',
      excluded: ['판매중', '판매종료', '판매취소'],
    },
    { label: '판매중', value: 'active', excluded: ['판매종료','판매취소'] },
    { label: '판매종료', value: 'inactive', excluded: ['대기','판매취소'] },
    { label: '판매취소', value: 'deleted', excluded: ['판매종료'] }
   
  ];

  const makeProductId = (productCategory: string | null | undefined, productIdx: number | undefined): string => {
    if (!productCategory || !productIdx) return '-';
    
    const paddedIdx = String(productIdx).padStart(4, '0');

    return `${productCategory}${paddedIdx}`;
  };

  const { mutateAsync: updateSupplierData } = useMutation({
    mutationFn: ({
      productIdx,
      supplierData,
    }: {
      productIdx: string;
      supplierData: UpdateSupplierRequest;
    }) => updateSupplier(productIdx, supplierData),
  });
  
  const handleClick = async () => {
    if (isEditing.supplier) {
    
      try {
        await updateSupplierData({ productIdx: productIdx!, supplierData });
    
      } catch (e) {
        console.error('API 호출 오류:', e);
       
      }
    } else {
     
      setSupplierData({
        supplierName: data?.supplierName || '',
        managerName: data?.managerName || '',
        managerPhone: data?.managerPhone || '',
        returnAddr: data?.returnAddr || '',
      });
    }  
  
    setIsEditing((prev) => ({ ...prev, supplier: !prev.supplier }));
  };

  const handleSaleClick = async () => {
    if (isEditing.sale) {
      const trimmedName = saleData.productName.trim();
      if (!trimmedName) {
        alert('상품명을 입력해주세요.');
        return;
      }
  
      if (saleData.productPrice <= saleData.costPrice) {
        alert('판매가는 공급가보다 높아야 합니다.');
        return;
      }
  
      if (saleData.productPrice > saleData.consumerPrice) {
        alert('판매가는 소비자가보다 높을 수 없습니다.');
        return;
      }
  
      if (saleData.consumerPrice < saleData.costPrice) {
        alert('소비자가는 공급가보다 낮을 수 없습니다.');
        return;
      }
  
      if (dayjs(saleData.launchStartT).isAfter(dayjs(saleData.launchEndT))) {
        alert('판매 시작일은 종료일보다 빠르거나 같아야 합니다.');
        return;
      }
      console.log('saleData', saleData);
  
      try {
        await updateSale(productIdx!, {
          ...saleData,
          productName: trimmedName,
        });
        await queryClient.invalidateQueries({ queryKey: ['productDetail', parsedIdx] });
        alert('저장 완료!');
        setSaleData((prev) => ({ ...prev, productName: trimmedName }));
        setIsEditing((prev) => ({ ...prev, sale: false }));

      } catch (error) {
        console.error('updateSale 실패:', error);
        alert('저장 중 오류가 발생했습니다.');
      }
      return;
    }
  

    setSaleData({
      productName: data?.productName || '',
      costPrice: data?.costPrice || 0,
      consumerPrice: data?.consumerPrice || 0,
      productPrice: data?.productPrice || 0,
      defaultShippingFee: data?.defaultShippingFee || 0,
      remoteShippingFee: data?.remoteShippingFee || 0,
      jejuShippingFee: data?.jejuShippingFee || 0,
      launchStartT: data?.launchStartT || '',
      launchEndT: data?.launchEndT || '',
    });
    setIsEditing((prev) => ({ ...prev, sale: true }));
  };

  const handleStockClick = async () => {
    if (isEditing.stock) {

      const remainingStockQuantity = Number(data?.maxQuantity) - Number(data?.stockQuantity) || 0;
      const newMaxQuantity = Number(stockData.maxQuantity) || 0;      
     
       
      if (newMaxQuantity < remainingStockQuantity) {
        alert(`입력하신 재고수량은 최소 ${remainingStockQuantity}개여야 합니다`);
        return; // 저장하지 않고 함수 종료
      }
      
      try {
        await updateStock(productIdx!, stockData.maxQuantity);

        await queryClient.invalidateQueries({ queryKey: ['productDetail', parsedIdx] });
      } catch (e) {
        console.error('API 호출 오류:', e);
        alert('재고 수량 저장 중 오류가 발생했습니다.');
      }
    } else {
      setStockData({
        maxQuantity: String(data?.maxQuantity || ''),
        stockQuantity: String(data?.stockQuantity || ''),
      });
    }
    setIsEditing((prev) => ({ ...prev, stock: !prev.stock }));
  };

  const handleChange = async () => {
    setIsEditing((prev) => ({ ...prev, status: !prev.status }));
  
    if (isEditing.status) {
      try {
        const selectedOption = menuOptions.find((opt) => opt.label === status);
        const statusLabel = selectedOption?.label || status;
  
        if (statusLabel === '판매중') {
          const start = dayjs(saleData.launchStartT || data?.launchStartT);
          const end = dayjs(saleData.launchEndT || data?.launchEndT);
          const today = dayjs().startOf('day');

          const fieldLabels: Partial<Record<keyof typeof saleData, string>> = {
            productName: '상품명',
            costPrice: '공급가',
            consumerPrice: '소비자가',
            productPrice: '판매가',
            defaultShippingFee: '기본 배송비',
            remoteShippingFee: '도서산간 배송비',
            jejuShippingFee: '제주 배송비',
            launchStartT: '판매 시작일',
            launchEndT: '판매 종료일',
          };
        
          const missingFields = Object.entries(fieldLabels)
          .filter(([key]) => {
            const value = data?.[key as keyof typeof saleData];
            if (typeof value === 'string') return value.trim() === '';
            if (typeof value === 'number') return Number.isNaN(value); // 0 도 누락 취급
            return value === null || value === undefined;
          })
          .map(([, label]) => label);
   
        if (missingFields.length > 0) {
          alert(`다음 항목을 입력해주세요: ${missingFields.join(', ')}`);
          return;         }
         
        }
  
        await updateProductStatus(productIdx!, statusLabel);
        alert(`${statusLabel}로 등록 상태가 변경되었습니다`);
      } catch (e) {
        console.error('API 호출 오류:', e);
      }
    } else {
      alert(
        '등록 상태를 판매 중으로 변경하면 사용자가 결제를 진행할 수 있습니다. 판매 정보를 충분히 검토하신 뒤, 등록 상태 변경을 권장 드립니다'
      );
      setStatus(data?.productStatus || '');
    }
  };

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);

  // 등록 버튼 클릭 시 파일 선택 다이얼로그 열기
  const handleRegisterClick = (kind: 'thumbnail' | 'detail') => {

    if (image[kind]) {
      alert('먼저 등록된 이미지를 삭제해주세요');
      return;
    }

    setIsEditing((prev) => ({ ...prev, [kind]: true }));
    // 파일 선택 다이얼로그 열기
    if (kind === 'thumbnail') {
      thumbnailInputRef.current?.click();
    } else {
      detailInputRef.current?.click();
    }
  };

  // 파일 선택 후 처리
  const handleFileChange = (kind: 'thumbnail' | 'detail', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // File 객체 저장 (multipart 전송용)
    setImageFiles((prev) => ({ ...prev, [kind]: file }));

    // 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setImagePreview((prev) => ({ ...prev, [kind]: previewUrl }));

    // TextField에도 파일명 표시
    setImage((prev) => ({ ...prev, [kind]: file.name }));
  };

  const handleSave = async (kind: 'thumbnail' | 'detail') => {
    if (!imageFiles[kind]) {
      alert('파일을 선택해주세요.');
      return;
    }

    try {
  
      await uploadProductFile(parsedIdx!, imageFiles[kind]!, kind as 'thumbnail' | 'detail');
      
      alert('저장 완료!');
      setIsEditing((prev) => ({ ...prev, [kind]: !prev[kind] }));
    } catch (e) {
      console.error(e);
      alert('저장 실패');
      console.log(imageFiles[kind]);
    }
  };

  // handleUploadFile 함수는 삭제 (handleSave로 통합)

  const handleDelete = async (kind: 'thumbnail' | 'detail') => {
    try {
      await deleteProductFile(parsedIdx!, kind, image[kind]!);
      alert('삭제 완료!');
      setImage((prev) => ({ ...prev, [kind]: '' }));
    } catch (e) {
      console.error(e);
      alert('삭제 실패');
    }
  };

  // 이미지 미리보기 핸들러
  const handleImagePreview = (kind: 'thumbnail' | 'detail') => {
    const imagePath = kind === 'thumbnail' ? data?.thumbUrl : data?.detailUrl;
    if (imagePath) {
      setPreviewImage(imagePath);
      setPreviewOpen(true);
    }
  };

  // 재고 수량 증감 핸들러
  const handleStockIncrement = (isAdd: boolean) => {
    const increment = Number(stockIncrement);
    const currentStockQuantity = Number(stockData.stockQuantity) || 0;
  
    // 줄이기일 때 재고 수량이 0이면 alert 표시
    if (!isAdd && currentStockQuantity <= 0) {
      alert('재고 수량이 0입니다. 더 이상 줄일 수 없습니다.');
      return;
    }
  
    const newMaxQuantity = isAdd 
      ? Number(stockData.maxQuantity) + increment 
      : Number(stockData.maxQuantity) - increment;
    
    const newStockQuantity = isAdd 
      ? currentStockQuantity + increment 
      : currentStockQuantity - increment;
  
    // 줄인 후에도 0보다 작아지면 alert 표시
    if (!isAdd && newStockQuantity < 0) {
      alert('재고 수량이 0입니다. 더 이상 줄일 수 없습니다.');
      return;
    }
  
    setStockData((prev) => ({ 
      ...prev, 
      maxQuantity: String(newMaxQuantity), 
      stockQuantity: String(newStockQuantity) 
    }));
  };

  const handleHistoryClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setHistoryType('status');
    setHistoryAnchorEl(event.currentTarget as HTMLButtonElement);
    try {
      const history = await getProductStatusHistory(parsedIdx!);
      setHistoryData((prev) => ({ ...prev, status: history }));
    } catch (e) {
      console.error('이력 조회 오류:', e);
      setHistoryData((prev) => ({ ...prev, status: [] }));
    }
  };
  
  const handleStockHistoryClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setHistoryType('stock');
    setHistoryAnchorEl(event.currentTarget as HTMLButtonElement);
    try {
      const history = await getStockStatusHistory(parsedIdx!);
      setHistoryData((prev) => ({ ...prev, stock: history }));
    } catch (e) {
      console.error('재고 이력 조회 오류:', e);
      setHistoryData((prev) => ({ ...prev, stock: [] }));
    }
  };

  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
    setHistoryType('status');
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
        <PageTitle title="상품 상세" />
      </div>
      

      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <h4 style={{ fontWeight: 'bold' }}>등록 정보</h4>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell>상품ID</TableCell>
                <TableCell>{makeProductId(data?.productCategory, data?.productIdx)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>상품 카테고리</TableCell>
                <TableCell>{PRODUCT_CATEGORY[data?.productCategory as keyof typeof PRODUCT_CATEGORY] || ''}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>등록 상태</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Select
                      value={status || ''}
                      onChange={(e) => setStatus(e.target.value)}
                      size="small"
                      sx={{ minWidth: 120, maxHeight: 40 }}
                      disabled={!isEditing.status}
                      
                    >
                      {menuOptions
                        .filter((opt) => {
                          // 현재 status의 label을 찾아서 excluded와 비교
                          const currentOption = menuOptions.find(opt => opt.label === data?.saleStatus);
                          const currentLabel = currentOption?.label || '';
                          return !opt.excluded.includes(currentLabel);
                        })
                        .map((opt) => (
                          <MenuItem key={opt.label} value={opt.label}>
                            {opt.label}
                          </MenuItem>
                        ))}
                    </Select>
                    <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleChange}
                      >
                        {isEditing.status ? '저장' : '변경'}
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
              <TableRow>
                <TableCell>등록일</TableCell>
                <TableCell>{dayjs(data?.createT).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>변경일</TableCell>
                <TableCell>{dayjs(data?.updateT).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h4 style={{ fontWeight: 'bold', marginTop: '1rem' }}>상품 이미지</h4>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell>썸네일 이미지</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <TextField
                      size="small"
                      variant="outlined"
                      disabled={!isEditing.thumbnail}
                      sx={{ 
                        minWidth: 300, 
                        minHieght: 50,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: !isEditing.thumbnail && !!data?.thumbUrl ? 'primary.main' : undefined,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: !isEditing.thumbnail && !!data?.thumbUrl ? 'primary.main' : undefined,
                          },
                        },
                      }}
                      placeholder="썸네일 이미지를 업로드 하세요"
                      value={image.thumbnail}
                      onChange={(e) => setImage((prev) => ({ ...prev, thumbnail: e.target.value }))}
                      onClick={() => {
                        if (data?.thumbUrl && !isEditing.thumbnail) {
                          handleImagePreview('thumbnail');
                        }
                      }}
                      InputProps={{
                        readOnly: !isEditing.thumbnail && !!data?.thumbUrl,
                        endAdornment: !isEditing.thumbnail && !!data?.thumbUrl ? (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImagePreview('thumbnail');
                              }}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : undefined,
                        sx: {
                          cursor: !isEditing.thumbnail && !!data?.thumbUrl ? 'pointer' : 'default',
                          backgroundColor: !isEditing.thumbnail && !!data?.thumbUrl ? 'action.hover' : 'background.paper',
                          '&:hover': {
                            backgroundColor: !isEditing.thumbnail && !!data?.thumbUrl ? 'action.selected' : undefined,
                          },
                        },
                      }}
                    />

                    {/* hidden file input */}
                    <input
                      type="file"
                      ref={thumbnailInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => handleFileChange('thumbnail', e)}
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        isEditing.thumbnail
                          ? handleSave('thumbnail')       
                          : handleRegisterClick('thumbnail')
                      }
                      sx={{ marginLeft: 'auto' }}
                    >
                      {isEditing.thumbnail ? '저장' : '등록'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete('thumbnail')}
                    >
                      삭제
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>상세 정보 이미지</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <TextField
                      size="small"
                      variant="outlined"
                      disabled={!isEditing.detail}
                      sx={{ 
                        minWidth: 300, 
                        minHieght: 40,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: !isEditing.detail && !!data?.detailUrl ? 'primary.main' : undefined,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: !isEditing.detail && !!data?.detailUrl ? 'primary.main' : undefined,
                          },
                        },
                      }}
                      placeholder="상세이미지를 업로드 하세요"
                      value={image.detail}
                      onChange={(e) => setImage((prev) => ({ ...prev, detail: e.target.value }))}
                      onClick={() => {
                        if (data?.detailUrl && !isEditing.detail) {
                          handleImagePreview('detail');
                        }
                      }}
                      InputProps={{
                        readOnly: !isEditing.detail && !!data?.detailUrl,
                        endAdornment: !isEditing.detail && !!data?.detailUrl ? (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImagePreview('detail');
                              }}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : undefined,
                        sx: {
                          cursor: !isEditing.detail && !!data?.detailUrl ? 'pointer' : 'default',
                          backgroundColor: !isEditing.detail && !!data?.detailUrl ? 'action.hover' : 'background.paper',
                          '&:hover': {
                            backgroundColor: !isEditing.detail && !!data?.detailUrl ? 'action.selected' : undefined,
                          },
                        },
                      }}
                    />

                    {/* hidden file input */}
                    <input
                      type="file"
                      ref={detailInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => handleFileChange('detail', e)}
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        isEditing.detail
                          ? handleSave('detail')       
                          : handleRegisterClick('detail')
                      }
                      sx={{ marginLeft: 'auto' }}
                    >
                      {isEditing.detail ? '저장' : '등록'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => {
                        handleDelete('detail');
                      }}
                    >
                      삭제
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}
          >
            <h4 style={{ fontWeight: 'bold' }}>공급사 정보</h4>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClick}
              sx={{ marginLeft: '0.5rem', height: '1.8rem' }}
            >
              {isEditing.supplier ? '저장' : '변경'}
            </Button>
          </Box>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell>공급사명</TableCell>
                <TableCell>
                  {isEditing.supplier ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={supplierData.supplierName}
                      onChange={(e) =>
                        setSupplierData((prev) => ({
                          ...prev,
                          supplierName: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    supplierData.supplierName || data?.supplierName
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>담당자</TableCell>
                <TableCell>
                  {isEditing.supplier ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={supplierData.managerName}
                      onChange={(e) =>
                        setSupplierData((prev) => ({
                          ...prev,
                          managerName: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    supplierData.managerName || data?.managerName
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>연락처</TableCell>
                <TableCell>
                  {isEditing.supplier ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={supplierData.managerPhone}
                      onChange={(e) =>
                        setSupplierData((prev) => ({
                          ...prev,
                          managerPhone: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    supplierData.managerPhone || data?.managerPhone
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>반품지주소</TableCell>
                <TableCell>
                  {isEditing.supplier ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={supplierData.returnAddr}
                      onChange={(e) =>
                        setSupplierData((prev) => ({
                          ...prev,
                          returnAddr: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    supplierData.returnAddr || data?.returnAddr
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
          <h4 style={{ fontWeight: 'bold' }}>판매 정보</h4>
            <Button
              variant="outlined"
              size="small"
              sx={{ marginLeft: '0.5rem', height: '1.8rem' }}
              onClick={handleSaleClick}
            >
              {isEditing.sale ? '저장' : '변경'}
            </Button>
          </Box>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
          <TableBody>
              <TableRow>
                <TableCell>상품명</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={saleData.productName}
                      onChange={(e) =>
                        setSaleData((prev) => ({
                          ...prev,
                          productName: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    saleData.productName || data?.productName
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '150px' }}>공급가</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={saleData.costPrice}
                      onChange={(e) =>
                        setSaleData((prev) => ({
                          ...prev,
                          costPrice: Number(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    saleData.costPrice || data?.costPrice
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>소비자가</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={saleData.consumerPrice}
                      onChange={(e) =>
                        setSaleData((prev) => ({
                          ...prev,
                          consumerPrice: Number(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    saleData.consumerPrice || data?.consumerPrice
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>판매가</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={saleData.productPrice}
                      onChange={(e) =>
                        setSaleData((prev) => ({
                          ...prev,
                          productPrice: Number(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    saleData.productPrice || data?.productPrice
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>기본 배송비</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={saleData.defaultShippingFee}
                      onChange={(e) =>
                        setSaleData((prev) => ({
                          ...prev,
                          defaultShippingFee: Number(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    saleData.defaultShippingFee || data?.defaultShippingFee
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>도서산간 추가 배송비</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={saleData.remoteShippingFee}
                      onChange={(e) =>
                        setSaleData((prev) => ({
                          ...prev,
                          remoteShippingFee: Number(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    saleData.remoteShippingFee || data?.remoteShippingFee
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>제주지역 추가 배송비</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <TextField
                      size="small"
                      variant="outlined"
                      value={saleData.jejuShippingFee}
                      onChange={(e) =>
                        setSaleData((prev) => ({
                          ...prev,
                          jejuShippingFee: Number(e.target.value),
                        }))
                      }
                      fullWidth
                    />
                  ) : (
                    saleData.jejuShippingFee || data?.jejuShippingFee
                  )}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>판매 기간(시작)</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <DateTimePicker
                      format="YYYY-MM-DD HH"
                      views={['year', 'month', 'day', 'hours']}
                      value={saleData.launchStartT ? dayjs(saleData.launchStartT) : null}
                      onChange={(date) => {
                        setSaleData((prev) => ({
                          ...prev,
                          launchStartT: date ? date.startOf('hour').format('YYYY-MM-DD HH') : '',
                        }));
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          variant: 'outlined',
                          fullWidth: true,
                        },
                      }}
                    />
                  ) : (
                    saleData.launchStartT 
                      ? dayjs(saleData.launchStartT).format('YYYY-MM-DD HH')
                      : (data?.launchStartT ? dayjs(data.launchStartT).format('YY년 MM월 DD일 HH시') : '-')
                  )}
                  
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>판매 기간(종료)</TableCell>
                <TableCell sx={{ py: isEditing.sale ? 1 : 'auto' }}>
                  {isEditing.sale ? (
                    <DateTimePicker
                      format="YYYY-MM-DD HH"
                      views={['year', 'month', 'day', 'hours']}
                      value={saleData.launchEndT ? dayjs(saleData.launchEndT).startOf('hour') : null}
                      onChange={(date) => {
                        setSaleData((prev) => ({
                          ...prev,
                          launchEndT: date ? date.startOf('hour').format('YYYY-MM-DD HH') : '',
                        }));
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          variant: 'outlined',
                          fullWidth: true,
                        },
                      }}
                    />
                  ) : (
                    saleData.launchEndT 
                      ? dayjs(saleData.launchEndT).format('YYYY-MM-DD HH')
                      : (data?.launchEndT ? dayjs(data.launchEndT).format('YY년 MM월 DD일 HH시') : '-')
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
          <h4 style={{ fontWeight: 'bold' }}>재고 정보</h4>
            <Button
              variant="outlined"
              size="small"
              sx={{ marginLeft: '0.5rem', height: '1.8rem' }}
              onClick={handleStockClick}
            >
              {isEditing.stock ? '저장' : '변경'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ marginLeft: '0.5rem', height: '1.8rem' }}
              onClick={handleStockHistoryClick}
            >
              이력조회
            </Button>
          </Box>
          <Table sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <TableBody>
            <TableRow>
                <TableCell sx={{ width: '150px' }}>재고 상태</TableCell>
                <TableCell>{data?.maxQuantity && data.maxQuantity >= 1 ? '판매 가능' : '품절'}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell sx={{ width: '250px' }}>남은 재고 수량/총 재고수량(현재)</TableCell>
                <TableCell>{data?.stockQuantity} / {data?.maxQuantity}</TableCell>
              </TableRow>

              {isEditing.stock && (
              <TableRow>
                  <TableCell>남은 재고 수량/총 재고수량(변경)</TableCell>
                  <TableCell sx={{ py: isEditing.stock ? 1 : 'auto' }}>
                    {isEditing.stock ? (
                      <Stack spacing={1}>
                        <TextField
                          size="small"
                          variant="outlined"
                          value={ stockData.stockQuantity + ' / ' +stockData.maxQuantity}
                          disabled={true}
                          onChange={(e) =>
                            setStockData((prev) => ({
                              ...prev,
                              maxQuantity: e.target.value,
                            }))
                          }
                          fullWidth
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          
                          <TextField
                            size="small"
                            variant="outlined"
                            value={stockIncrement}
                            onChange={(e) => setStockIncrement(e.target.value)}
                            placeholder="수량 입력"
                            sx={{ width: '80px', maxHeight: 60}}
                            inputProps={{
                              style: { textAlign: 'center' },
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleStockIncrement(false)}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleStockIncrement(true)}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    ) : (
                      stockData.maxQuantity || data?.maxQuantity
                    )}
                  </TableCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {/* 이미지 미리보기 Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          이미지 미리보기
          <IconButton
            aria-label="close"
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <img
              src={previewImage}
              alt="미리보기"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-image.png';
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* 이력조회 Popover */}
      
      <Popover
        open={Boolean(historyAnchorEl)}
        anchorEl={historyAnchorEl}
        onClose={handleHistoryClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, minWidth: 200, maxWidth: 300, maxHeight: 300, overflow: 'auto' }}>
          {historyType === 'status' && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                상태변경 이력
              </Typography>
              {historyData.status && historyData.status.length > 0 ? (
                <Stack spacing={0.5}>
                  {historyData.status.map((item, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  이력이 없습니다.
                </Typography>
              )}
            </>
          )}

          {historyType === 'stock' && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                재고 이력
              </Typography>
              {historyData.stock && historyData.stock.length > 0 ? (
                <Stack spacing={0.5}>
                  {historyData.stock.map((item, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  이력이 없습니다.
                </Typography>
              )}
            </>
          )}
        </Paper>
      </Popover>
    </Box>
  );
};

export default AppRegisterView;
