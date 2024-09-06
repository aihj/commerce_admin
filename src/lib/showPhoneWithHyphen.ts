export const showPhoneWithHyphen = (value: string) => {
  return value.replace(
    /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
    '$1-$2-$3'
  );
};
