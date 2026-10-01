import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  content: string;
  element: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

const TooltipBasic = ({ content, element, position = 'top' }: Props) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs" side={position}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipBasic;
