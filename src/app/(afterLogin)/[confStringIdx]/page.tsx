'use client';

import { getPcoInfoForFirst } from '@/api/publicApi';
import { PageLoading } from '@/components/core/Loading';
import { useAppDispatch } from '@/redux/hooks';
import { UPDATE_PCO } from '@/redux/slices/pcoSlice';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const conferenceStringIdx = usePathname();
  const dispatch = useAppDispatch();
  const { isPending, data: pcoInfoData } = useQuery({
    queryKey: ['getPcoInfo'],
    queryFn: () =>
      getPcoInfoForFirst(conferenceStringIdx.substring(1)).then((result) => {
        dispatch(UPDATE_PCO(result));
        return result;
      }),
  });

  if (isPending) {
    return <PageLoading />;
  }

  if (status !== 'loading') {
    if (session) {
      return <article>{pcoInfoData?.conferenceStringIdx}</article>;
    } else {
      router.replace('/');
    }
  }
}
