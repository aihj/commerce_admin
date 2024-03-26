import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const dateFormat = (date: string, format: string = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export { dayjs, dateFormat };
