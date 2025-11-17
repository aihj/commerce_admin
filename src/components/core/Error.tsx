type ErrorPageTypes = {
  error?: string;
};

// TODO : 404 페이지 디자인 작업 필요함 - 이때는 Footer와 Header 노출할 필요 없음

// eslint-disable-next-line no-empty-pattern
const Error = ({ error }: ErrorPageTypes) => {
  return (
    <article>
      {error?.response?.data?.status === 404
        ? '해당 페이지가 존재하지 않습니다.'
        : '현재 서버에 문제가 있어 데이터를 불러 올 수 없습니다. 관리자에게 문의하세요.'}
    </article>
  );
};

export { Error };
