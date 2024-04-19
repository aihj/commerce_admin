import { useParams } from 'next/navigation';

type SessionGroupFormTypes = NonNullable<unknown>;

// 하나의 세션 그룹에 대한 Form
// eslint-disable-next-line no-empty-pattern
export default function SessionListForm({}: SessionGroupFormTypes) {
  const { confStringIdx, sessionGroupIdx } = useParams();
  return (
    <article>
      세션 리스트 form
      {confStringIdx}
      {sessionGroupIdx}
    </article>
  );
}
