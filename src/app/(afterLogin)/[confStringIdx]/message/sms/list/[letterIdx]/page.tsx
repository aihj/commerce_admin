import { SMSSendDetail } from '.';

const SMSSendDetailPage = ({ params }: { params: { letterIdx: string } }) => {
  return <SMSSendDetail letterIdx={params.letterIdx} />;
};

export default SMSSendDetailPage;
