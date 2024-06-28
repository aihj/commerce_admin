'use client';

import * as React from 'react';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Layout as DefaultLayout } from '@/components/layout';
import { useAppDispatch } from '@/redux/hooks';
import { UPDATE_PCO } from '@/redux/slices/pcoSlice';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getPcoInfoForFirst } from '@/api/publicApi';
import { PageLoading } from '@/components/core/Loading';
import { Error } from '@/components/core/Error';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const url = protocol + '//' + hostname;

  const { confStringIdx } = useParams();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    // data: pcoInfoData,
  } = useQuery({
    queryKey: ['getPcoInfo', confStringIdx],
    queryFn: () =>
      getPcoInfoForFirst(url, confStringIdx as string).then((result) => {
        dispatch(UPDATE_PCO(result));
        return result;
      }),
  });

  if (isLoading) {
    return <PageLoading />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <div>
      <AuthGuard>
        <DefaultLayout>{children}</DefaultLayout>
      </AuthGuard>
    </div>
  );
};

export default Layout;
