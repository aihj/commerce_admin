import { SvgIcon } from '@mui/material';
import { IconProps } from './IconProps';

const InfoFilledIcon = ({ size = 24, fill = '#4338CA' }: IconProps) => {
  return (
    <SvgIcon>
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.99935 2.16699C5.39935 2.16699 1.66602 5.90033 1.66602 10.5003C1.66602 15.1003 5.39935 18.8337 9.99935 18.8337C14.5993 18.8337 18.3327 15.1003 18.3327 10.5003C18.3327 5.90033 14.5993 2.16699 9.99935 2.16699ZM10.8327 14.667H9.16602V9.66699H10.8327V14.667ZM10.8327 8.00033H9.16602V6.33366H10.8327V8.00033Z"
          fill={fill}
        />
      </svg>
    </SvgIcon>
  );
};

export { InfoFilledIcon };
