import * as React from 'react';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Layout as DefaultLayout } from '@/components/layout';
import { useAppDispatch } from '@/redux/hooks';
import { UPDATE_PCO } from '@/redux/slice/pcoSlice';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getPcoInfoForFirst } from '@/api/publicApi';
import { PageLoading } from '@/components/core/Loading';
import { Error } from '@/components/core/Error';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): React.JSX.Element => {
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
      getPcoInfoForFirst(url, confStringIdx as string).then((res) => {
        dispatch(UPDATE_PCO(res.data.content));
        return res.data.content;
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
