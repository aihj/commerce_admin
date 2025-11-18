import { useQuery } from '@tanstack/react-query';
import { ImageCard } from '@/components/core/ImageCard';
import { PATH } from '@/paths';
import { useSession } from 'next-auth/react';
import { getAllOrders } from '@/api/orderApi';

const MediMain = () => {
  const { update } = useSession();

  const {
    isLoading,
    // error,
    data: adminOpenStatusActivePcoList,
  } = useQuery({
    queryKey: ['getAllOrders'],
    queryFn: () => getAllOrders(),
  });
  if (!adminOpenStatusActivePcoList || isLoading) return '';

  return (
    <article className="flex flex-col gap-24">
      {adminOpenStatusActivePcoList?.map((item) => (
        <ImageCard
          key={item.orderIdx}
          orderStatus={item.orderStatus as string}
          title={item.productName}
          onClickLink={PATH.EACH.MAIN(item.orderIdx.toString())}
          onClick={() => update({ orderIdx: item.orderIdx })}
          startDate={item.createT}
          endDate={item.createT}
          preRegiStartT={item.createT}
          preRegiEndT={item.createT}
        />
      ))}
    </article>
  );
};
export { MediMain };
