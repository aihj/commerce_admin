import { SvgIcon } from '@mui/material';
import { IconProps } from './IconProps';

const MemoIcon = ({ size = 24 }: IconProps) => {
  return (
    <SvgIcon style={{ fontSize: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.49999 11V3.00002H11.5V6.7715C11.5 8.825 8.49997 8 8.49997 8C8.49997 8 9.25897 11 7.18097 11H3.49999ZM12.5 7.193V2.00002H2.49999V12H7.59447C9.17597 12 12.5 8.3885 12.5 7.193ZM11 1.00003H1.5V10.5H0.5V3.05176e-05H11V1.00003Z"
          fill="#C9A62C"
        />
        <path
          d="M3.49072 3.00928V11.0092H7.17171C9.2497 11.0092 8.4907 8.00926 8.4907 8.00926C8.4907 8.00926 11.4907 8.83425 11.4907 6.78076V3.00928H3.49072Z"
          fill="#FFE793"
        />
      </svg>
    </SvgIcon>
  );
};

export { MemoIcon };
