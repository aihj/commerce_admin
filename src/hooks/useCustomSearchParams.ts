'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { logger } from '@/lib/logger/defaultLogger';
import { produce } from 'immer';

const useCustomSearchParams = <T>(initialParams: T) => {
  const router = useRouter();
  const pathname = usePathname();
  const [cSearchParams, setCSearchParams] = useState<T>();

  // router 파라미터에 값 삽입
  const setCSearchParamsFunc = useCallback(
    (_params: T) => {
      logger.debug('<setCSearchParamsFunc> _params : ', _params);
      console.log('cSearchParams--', cSearchParams);
      const newData = produce(cSearchParams, (draft: T) => {
        return { ...draft, ..._params };
      });
      setCSearchParams(newData);
      console.log();
      if (newData) {
        router.push(`${pathname}?${new URLSearchParams(newData).toString()}`);
      }
    },
    [cSearchParams, pathname, router]
  );

  const deleteCSearchParams = useCallback(() => {
    setCSearchParamsFunc(initialParams);
  }, []);

  useEffect(() => {
    logger.debug('setCSearchParams 초기화');
    setCSearchParamsFunc(initialParams);
  }, []);
  return {
    cSearchParams,
    setCSearchParamsFunc,
    deleteCSearchParams,
  };
};

export default useCustomSearchParams;
