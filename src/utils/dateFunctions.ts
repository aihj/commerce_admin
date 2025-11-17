//  현재 문자열이 데이트 형식인지 확인("YYYY-MM-DD" 또는 "YYYY-MM-DD HH:mm:ss"일 경우 true)

import dayjs from 'dayjs';

export const isDate = (value) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;
  return dateRegex.test(value);
};

// Wed Apr 17 2024 17:05:26 GMT+0900 (한국 표준시) 이런 형식이 2024-04-17 이렇게 변경되어야 함
export const formatDatePickerInList = (list, _value) => {
  if (!Array.isArray(list)) {
    return list;
  }

  return list.map((item) => ({
    ...item,
    [_value]: item[_value] && dayjs(item[_value]).format('YYYY-MM-DD'),
  }));
};
export const formatDatePickerTimeInList = (list, _startName, _endName) => {
  if (!Array.isArray(list)) {
    return list;
  }

  return list.map((item) => ({
    ...item,
    [_startName]:
      item[_startName] && dayjs(item[_startName]).format('YYYY-MM-DD HH:mm:ss'),
    [_endName]:
      item[_endName] && dayjs(item[_endName]).format('YYYY-MM-DD HH:mm:ss'),
  }));
};
