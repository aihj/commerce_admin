import { TableSearchParams } from '@/api/types/tableSearchParams';

export const mergeSearchParams = (
  searchParams: TableSearchParams,
  initialData: TableSearchParams
) => {
  // searchParams가 존재하면 해당 값을 유지하고, 없을 경우에만 initialData 사용
  const mergedParams: TableSearchParams = searchParams
    ? { ...searchParams }
    : { ...initialData };

  // searchParams에 없는 키만 추가
  Object.keys(initialData).forEach((key) => {
    if (!(key in mergedParams)) {
      mergedParams[key] = initialData[key];
    }
  });

  return mergedParams;
};
