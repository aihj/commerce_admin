import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';

export const enum CHIP_COLOR {
  primary = 'primary',
  success = 'success',
  error = 'error',
  neutral = 'neutral',
  secondary = 'secondary',
  info = 'info',
  warning = 'warning',
  pink = 'pink',
}

interface ChipProps {
  label: string;
  type?: 'soft' | 'strong';
  color?: CHIP_COLOR;
  onDelete?: () => void;
}

const getStyle = (type: string, color: string) => {
  if (type === 'soft') {
    switch (color) {
      case 'primary':
        return `text-primary-main bg-primary-lightest`;
      case 'success':
        return `text-success-main bg-success-lightest`;
      case 'error':
        return `text-error-main bg-error-lightest`;
      case 'neutral':
        return `text-neutral-main bg-neutral-lightest`;
      case 'secondary':
        return `text-secondary-main bg-neutral-lightest`;
      case 'info':
        return `text-info-main bg-info-lightest`;
      case 'warning':
        return `text-warning-main bg-warning-lightest`;
      case 'pink':
        return `text-pink-main bg-error-lightest`;
    }
  } else {
    switch (color) {
      case 'primary':
        return `text-white bg-primary-main`;
      case 'success':
        return `text-white bg-success-main`;
      case 'error':
        return `text-white bg-error-main`;
      case 'neutral':
        return `text-white bg-neutral-main`;
      case 'secondary':
        return `text-white bg-secondary-main`;
      case 'info':
        return `text-white bg-info-main`;
      case 'warning':
        return `text-white bg-warning-main`;
      case 'pink':
        return `text-white bg-pink-main`;
    }
  }
};

const Chip = ({
  label,
  type = 'strong',
  color = CHIP_COLOR.primary,
  onDelete,
}: ChipProps) => {
  return (
    <div
      className={`flex items-center py-3 px-10 rounded-12 w-max ${getStyle(type, color)}`}
    >
      <span className="text-12 leading-18 font-semibold">{label}</span>
      {onDelete ? (
        <button onClick={() => onDelete()}>
          <XCircleIcon className="w-20 h-20 pl-2" />
        </button>
      ) : null}
    </div>
  );
};

export { Chip };
