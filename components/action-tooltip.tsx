import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionTooltipProps {
    label: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'end' | 'center';
    children: React.ReactNode;
}

const ActionTooltip = ({ label, side, align, children }: ActionTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={ 50 }>
                <TooltipTrigger asChild>
                    { children }
                </TooltipTrigger>
                <TooltipContent side={ side } align={ align }>
                    <p className='font-semibold text-sm capitalize'>{ label.toLowerCase() }</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default ActionTooltip;