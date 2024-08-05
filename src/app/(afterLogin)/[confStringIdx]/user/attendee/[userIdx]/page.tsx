import { UserDetail } from '.';

const UserDetailPage = ({ params }: { params: { userIdx: number } }) => {
  return <UserDetail userIdx={params.userIdx} />;
};

export default UserDetailPage;
