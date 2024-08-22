import { cva } from 'class-variance-authority';
interface LabelProps {
  label: string;
  minWidth?: 100 | 140 | 180 | 200;
}

const labelVariants = cva(`font-medium text-14 leading-16 pb-6`, {
  variants: {
    minWidth: {
      100: `min-w-100`,
      140: `min-w-140`,
      180: `min-w-180`,
      200: `min-w-200`,
    },
  },
});

const Label = ({ label, minWidth = 180 }: LabelProps) => {
  const className = labelVariants({ minWidth });
  return <div className={className}>{label}</div>;
};

export { Label };
