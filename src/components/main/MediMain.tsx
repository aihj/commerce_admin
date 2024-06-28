import { ImageCard } from '@/components/core/ImageCard';
import { getAdminOpenStatusActivePcoList } from '@/api/mediAdminApi';
import { useQuery } from '@tanstack/react-query';
import { PATH } from '@/paths';

type MediMainTypes = NonNullable<unknown>;

// eslint-disable-next-line no-empty-pattern
const MediMain = ({}: MediMainTypes) => {
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
