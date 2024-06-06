type ErrorPageTypes = NonNullable<unknown>;

// eslint-disable-next-line no-empty-pattern
export default function ErrorPage({}: ErrorPageTypes) {
  return (
    <article>
      현재 서버에 문제가 있어 해당 작업을 진행할 수 없습니다. 관리자에게
      문의하세요.
    </article>
  );
}
