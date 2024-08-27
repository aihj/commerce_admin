import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';

interface ChipProps {
  label: string;
  type?: 'soft' | 'strong';
  color?: 'primary' | 'secondary';
  onDelete?: () => void;
}

const getStyle = (type: string, color: string) => {
  if (type === 'soft') {
    switch (color) {
      case 'secondary':
        return `text-secondary-main bg-secondary-light`;
    }
  } else {
    switch (color) {
      case 'secondary':
        return `text-secondary-main bg-secondary-light`;
    }
  }
};

const Chip = ({
  label,
  type = 'strong',
  color = 'primary',
  onDelete,
}: ChipProps) => {
  return (
    <div
      className={`flex items-center py-3 px-10 rounded-12 ${getStyle(type, color)}`}
    >
      <span className="text-14 leading-16 font-semibold">{label}</span>
      {onDelete ? (
        <button onClick={() => onDelete()}>
          <XCircleIcon className="w-20 h-20 pl-2" />
        </button>
      ) : null}
    </div>
  );
};

export { Chip };
