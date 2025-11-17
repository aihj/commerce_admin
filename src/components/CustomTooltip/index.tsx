import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 200,
    background: '#384250',
    marginTop: '0 !important',
  },
});

export { CustomTooltip };
