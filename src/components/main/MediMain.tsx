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
            key={item.conferenceIdx}
            imageUrl={item.thumbnailImageUrl as string}
            title={item.conferenceName}
            onClickLink={PATH.EACH.MAIN(item.conferenceStringIdx)}
            onClick={() => update({ conferenceIdx: item.conferenceIdx })}
          >
            <p>
              {item.conferenceStartT} ~ {item.conferenceEndT}
            </p>
          </ImageCard>
        );
      })}
    </article>
  );
};
export { MediMain };
