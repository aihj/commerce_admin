'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { logger } from '@/lib/logger/defaultLogger';
import { produce } from 'immer';

type NewParamsType = { [key: string]: string };

const useCustomSearchParams = <T>(initialParams: T) => {
  const router = useRouter();
  const pathname = usePathname();
  const [cSearchParams, setCSearchParams] = useState<T>();

  // router 파라미터에 값 삽입
  const setCSearchParamsFunc = useCallback(
    (_params: NewParamsType) => {
      if (_params === null) setCSearchParams({});
      logger.debug('<setCSearchParamsFunc> _params : ', _params);
      const newData = produce(cSearchParams, (draft) => {
        return { ...draft, ..._params };
      });
      setCSearchParams(newData);
      router.push(`${pathname}?${newData.toString()}`);
    },
    [cSearchParams, pathname, router]
  );

  useEffect(() => {
    logger.debug('setCSearchParams 초기화');
    setCSearchParamsFunc(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialParams]);

  return {
    cSearchParams,
    setCSearchParamsFunc,
  };
};

export default useCustomSearchParams;
