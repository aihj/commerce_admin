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
  console.log(adminOpenStatusActivePcoList);
  return (
    <article className="flex flex-col gap-24">
      {adminOpenStatusActivePcoList?.map((item) => (
        <ImageCard
          key={item.conferenceIdx}
          imageUrl={item.thumbnailImageUrl as string}
          title={item.conferenceName}
          onClickLink={PATH.EACH.MAIN(item.conferenceStringIdx)}
          onClick={() => update({ conferenceIdx: item.conferenceIdx })}
          startDate={item.conferenceStartT}
          endDate={item.conferenceEndT}
          preRegiStartT={item.conferencePreRegiStartT}
          preRegiEndT={item.conferencePreRegiEndT}
        />
      ))}
    </article>
  );
};
export { MediMain };
