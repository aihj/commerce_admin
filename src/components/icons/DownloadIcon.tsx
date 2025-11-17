import { SvgIcon } from '@mui/material';
import { IconProps } from './IconProps';

const DownloadIcon = ({
  size = 24,
  fill = '#6C737F',
  className,
}: IconProps) => {
  return (
    <SvgIcon className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z" fill={fill} />
      </svg>
    </SvgIcon>
  );
};

export { DownloadIcon };
