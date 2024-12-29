import { Grid } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

const WorkSpace = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md p-2">
            <Grid className="h-6 w-6" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          sideOffset={8}
          className="bg-white text-black rounded-md p-2 shadow-lg"
        >
          <p>워크스페이스</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WorkSpace;
