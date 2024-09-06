export const calculateByteLength = (text: string) => {
  // UTF-8로 인코딩된 문자열의 바이트 길이를 계산하는 함수
  return new TextEncoder().encode(text).length;
};
