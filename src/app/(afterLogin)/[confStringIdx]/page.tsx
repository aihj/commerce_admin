'use client';

import { getPcoInfoForFirst } from '@/api/publicApi';
import { PageLoading } from '@/components/core/Loading';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { UPDATE_PCO, selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const conferenceIdx = useAppSelector(selectConferenceIdx);
  const conferenceStringIdx = usePathname();
  const dispatch = useAppDispatch();
  const data = {
    conferenceIdx: conferenceIdx as number,
    conferenceStringIdx: conferenceStringIdx.substring(1),
  };
  const { isPending, data: pcoInfoData } = useQuery({
    queryKey: ['getPcoInfo'],
    queryFn: () =>
      getPcoInfoForFirst(data).then((result) => {
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
};

export default Home;
