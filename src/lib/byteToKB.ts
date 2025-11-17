export const bytesToKB = (bytes: number) => {
  return (bytes / 1024).toFixed(2); // 소수점 둘째 자리까지 반올림
};
