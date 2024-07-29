'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { logger } from '@/lib/logger/defaultLogger';

type NewParamsType = { [key: string]: string };

const useCustomSearchParamsOld = <T>(initialParams: T) => {
  const router = useRouter();
  const pathname = usePathname();
  const _searchParams = useSearchParams();
  const cSearchParams = useMemo(() => {
    return new URLSearchParams(_searchParams.toString());
  }, [_searchParams]);

  useEffect(() => {
    logger.debug('initialParams : ', initialParams);
    setCSearchParams(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialParams]);

  // 객체에 값 삽입
  const setNewParams = useCallback(
    (newParams: NewParamsType) => {
      for (const [key, value] of Object.entries(newParams)) {
        if (value) cSearchParams.set(key, value);
        else cSearchParams.delete(key);
      }
      return cSearchParams.toString();
    },
    [cSearchParams]
  );

  // router 파라미터에 값 삽입
  const setCSearchParams = useCallback(
    (newParams: NewParamsType) => {
      return router.push(`${pathname}?${setNewParams(newParams)}`);
    },
    [pathname, router, setNewParams]
  );

  return {
    cSearchParams: Object.fromEntries(cSearchParams),
    setCSearchParams,
  };
};

export default useCustomSearchParamsOld;
