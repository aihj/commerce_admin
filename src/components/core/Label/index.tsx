import { cva } from 'class-variance-authority';
interface LabelProps {
  label: string;
  minWidth?: 80 | 100 | 140 | 180 | 200;
  bold?: boolean;
}

const labelVariants = cva(`text-14 leading-16 pb-6`, {
  variants: {
    bold: {
      true: 'font-bold',
      false: 'font-medium',
    },
    minWidth: {
      80: `min-w-80`,
      100: `min-w-100`,
      140: `min-w-140`,
      180: `min-w-180`,
      200: `min-w-200`,
    },
  },
});

const Label = ({ label, minWidth = 180, bold = false }: LabelProps) => {
  const className = labelVariants({ minWidth, bold });
  return <div className={className}>{label}</div>;
};

export { Label };
