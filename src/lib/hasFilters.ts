const defaultParam = [
  'currentPage',
  'conferenceIdx',
  'rowsPerPage',
  'sortDir',
  'desc',
  'sortType',
];

export const hasFilters = (filters: any): boolean => {
  for (const key in filters) {
    if (defaultParam.findIndex((param) => param === key) == -1) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        // if (filters.hasOwnProperty(key)) {
        // 필수는 아님
        if (filters[key] !== undefined && filters[key] !== null) {
          return true; // 하나의 값이라도 undefined나 null이 아니면 true 반환
        }
      }
    }
  }
  return false; // 모든 값이 undefined 또는 null일 경우 false 반환
};
