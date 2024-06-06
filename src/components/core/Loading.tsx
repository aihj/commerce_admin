type LoadingPageTypes = NonNullable<unknown>;

// eslint-disable-next-line no-empty-pattern
export default function LoadingPage({}: LoadingPageTypes) {
  return (
    <article>데이터를 가져오고 있는 중입니다. 잠시만 기다려주세요.</article>
  );
}
