'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

type NewParamsType = { [key: string]: string };

const useCustomSearchParams = <T>(initialParams: T) => {
  const router = useRouter();
  const pathname = usePathname();
  const _searchParams = useSearchParams();
  const cSearchParams = useMemo(() => {
    return new URLSearchParams(_searchParams.toString());
  }, [_searchParams]);

  useEffect(() => {
    setCSearchParams(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialParams]);

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

export default useCustomSearchParams;
