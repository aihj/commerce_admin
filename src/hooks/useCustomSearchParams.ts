'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const useCustomSearchParams = <T>(initialParams: T) => {
  const router = useRouter();
  const pathname = usePathname();
  const [cSearchParams, setCSearchParams] = useState<T>(initialParams);

  const setCSearchParamsFunc = (param: T) => {
    const key = Object.keys(param as object)[0];
    if (key !== 'currentPage') {
      param = { ...param, currentPage: 0 };
    }
    setCSearchParams((prev) => ({ ...prev, ...param }));
  };

  const deleteCSearchParams = () => {
    setCSearchParams(initialParams);
  };

  useEffect(() => {
    router.replace(
      `${pathname}?${new URLSearchParams(cSearchParams as string).toString()}`
    );
  }, [cSearchParams, router, pathname]);

  return {
    cSearchParams,
    setCSearchParamsFunc,
    deleteCSearchParams,
  };
};

export default useCustomSearchParams;
