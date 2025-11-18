const numberWithComma = (num: number) => {
  if (num === null || num === undefined) return num;
  const regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regexp, ',');
};

export { numberWithComma };
