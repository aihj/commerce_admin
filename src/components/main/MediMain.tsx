import { useQuery } from '@tanstack/react-query';
import { ImageCard } from '@/components/core/ImageCard';
import { getAdminOpenStatusActivePcoList } from '@/api/mediAdminApi';
import { PATH } from '@/paths';
import { useSession } from 'next-auth/react';

const MediMain = () => {
  const { update } = useSession();

  const {
    isLoading,
    // error,
    data: adminOpenStatusActivePcoList,
  } = useQuery({
    queryKey: ['getAdminOpenStatusActivePcoList'],
    queryFn: () => getAdminOpenStatusActivePcoList(),
  });
  // window.adminOpenStatusActivePcoList = adminOpenStatusActivePcoList;

  if (!adminOpenStatusActivePcoList || isLoading) return '';
  return (
    <article>
      {adminOpenStatusActivePcoList?.map((item) => {
        return (
          <ImageCard
            key={item.conference_idx}
            imageUrl={item.thumbnailImageUrl as string}
            title={item.conference_name}
            onClickLink={PATH.EACH.MAIN(item.conference_string_idx)}
            onClick={() => update({ conferenceIdx: item.conference_idx })}
          >
            <p>
              {item.conference_start_t} ~ {item.conference_end_t}
            </p>
            <p>{item.committee_name}</p>
          </ImageCard>
        );
      })}
    </article>
  );
};
export { MediMain };
