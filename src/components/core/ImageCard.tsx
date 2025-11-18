import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from 'next/link';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { CHIP_COLOR, Chip } from './Chip';

dayjs.extend(isBetween);

type ImageCardTypes = {
  orderStatus: string;
  title: string;
  onClickLink: string;
  // children: ReactNode;
  onClick: () => void;
  startDate: string;
  endDate: string;
  preRegiStartT: string;
  preRegiEndT: string;
};

const ImageCard = ({
  orderStatus,
  onClickLink,
  title,
  // children,
  onClick,
  startDate,
  endDate,
  preRegiStartT,
  preRegiEndT,
}: ImageCardTypes) => {
  const isOngoing = dayjs().isBetween(startDate, endDate);
  const isPreRegiOngoing = dayjs().isBetween(preRegiStartT, preRegiEndT);
  return (
    <Card onClick={onClick} sx={{ maxWidth: 500 }}>
      <Link href={onClickLink}>
        <CardContent sx={{ p: '24px !important' }}>
          <div className="flex flex-col gap-16">
            <span className="Title-22-Bold">{title}</span>
            <span className="Label-16-SemiBold">{orderStatus}</span>
            <div>
              {preRegiStartT && preRegiEndT ? (
                <div className="flex gap-8 items-center">
                  <dt className="Label-16-Regular">판매 기간: </dt>
                  <dd className="flex gap-8">
                    <span className="Label-16-SemiBold">
                      {`${dayjs(preRegiStartT).format('YYYY-MM-DD')} ~ ${dayjs(preRegiEndT).format('YYYY-MM-DD')}`}
                    </span>
                    {isPreRegiOngoing ? (
                      <Chip
                        label="사전 등록중"
                        type="soft"
                        color={CHIP_COLOR.info}
                      />
                    ) : null}
                  </dd>
                </div>
              ) : null}
              <div className="flex gap-8 items-center">
                <dt className="Label-16-Regular">주문일: </dt>
                <dd className="flex gap-8">
                  <span className="Label-16-SemiBold">
                    {dayjs(startDate).format('YYYY-MM-DD') ===
                    dayjs(endDate).format('YYYY-MM-DD')
                      ? dayjs(startDate).format('YYYY-MM-DD')
                      : `${dayjs(startDate).format('YYYY-MM-DD')} ~ ${dayjs(endDate).format('YYYY-MM-DD')}`}
                  </span>
                  {isOngoing ? (
                    <Chip label="진행중" type="soft" color={CHIP_COLOR.pink} />
                  ) : null}
                </dd>
              </div>
            </div>
          </div>
        </CardContent>
        {/*</CardActionArea>*/}
      </Link>
    </Card>
  );
};
export { ImageCard };
