import { UserDetail } from '.';

const UserDetailPage = ({ params }: { params: { attendeeIdx: number } }) => {
  return <UserDetail attendeeIdx={params.attendeeIdx} />;
};

export default UserDetailPage;
